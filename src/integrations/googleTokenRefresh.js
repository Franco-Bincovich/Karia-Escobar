// integrations/googleTokenRefresh.js
// Refresco de tokens OAuth2 de Google con deduplicación de requests concurrentes.

const { google } = require('googleapis');
const config = require('../config');
const integracionService = require('../services/integracionService');
const logger = require('../utils/logger').child({ module: 'googleTokenRefresh' });

const SERVICIOS_GOOGLE = ['gmail', 'drive', 'calendar'];

// Deduplicación de refreshes concurrentes: evita que dos requests simultáneos
// con el mismo token expirado lancen dos llamadas a refreshAccessToken para el mismo userId.
const refreshInFlight = new Map(); // userId → Promise<credentials>

/**
 * Refresca el access_token y persiste los nuevos tokens en todos los servicios Google.
 * Si ya hay un refresh en curso para ese userId devuelve la misma promesa.
 *
 * @param {string} userId
 * @param {string} refreshToken - refresh_token vigente
 * @param {{ clientId: string, clientSecret: string }} clientCreds - credenciales OAuth del cliente
 * @returns {Promise<Object>} credentials de googleapis
 */
async function refreshAndPersist(userId, refreshToken, clientCreds) {
  if (refreshInFlight.has(userId)) return refreshInFlight.get(userId);

  const promise = (async () => {
    const tempClient = new google.auth.OAuth2(
      clientCreds.clientId,
      clientCreds.clientSecret,
      config.google.redirectUri
    );
    tempClient.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await tempClient.refreshAccessToken();

    const resultados = await Promise.allSettled(
      SERVICIOS_GOOGLE.map((s) =>
        integracionService.guardarTokenGoogle(userId, s, {
          access_token: credentials.access_token,
          refresh_token: credentials.refresh_token || refreshToken,
          expiry: credentials.expiry_date,
          client_id: clientCreds.clientId,
          client_secret: clientCreds.clientSecret,
        })
      )
    );
    resultados.forEach((r, i) => {
      if (r.status === 'rejected') {
        logger.warn('No se pudo persistir token Google', {
          userId,
          servicio: SERVICIOS_GOOGLE[i],
          error: r.reason?.message,
        });
      }
    });

    return credentials;
  })().finally(() => refreshInFlight.delete(userId));

  refreshInFlight.set(userId, promise);
  return promise;
}

module.exports = { refreshAndPersist };
