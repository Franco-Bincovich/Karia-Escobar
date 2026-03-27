// integrations/googleClient.js
// Crea un cliente OAuth2 autenticado para un usuario.
// Refresca tokens expirados delegando a googleTokenRefresh.

const { google } = require('googleapis');
const config = require('../config');
const { AppError } = require('../middleware/errorHandler');
const integracionService = require('../services/integracionService');
const { refreshAndPersist } = require('./googleTokenRefresh');
const logger = require('../utils/logger').child({ module: 'googleClient' });

/**
 * Devuelve un cliente OAuth2 autenticado y listo para usar.
 * Refresca el access_token automáticamente si expiró.
 *
 * @param {string} userId
 * @param {'gmail'|'drive'|'calendar'} tipo - servicio que se va a usar
 * @returns {Promise<import('googleapis').Auth.OAuth2Client>}
 * @throws {AppError} GOOGLE_NOT_CONNECTED | GOOGLE_CREDENTIALS_MISSING | GOOGLE_TOKEN_EXPIRED
 */
async function getGoogleClient(userId, tipo) {
  let creds;
  try {
    creds = await integracionService.getCredenciales(userId, tipo);
    logger.debug('Credenciales obtenidas', {
      userId,
      tipo,
      tieneAccessToken: !!creds.access_token,
      tieneRefreshToken: !!creds.refresh_token,
      tieneExpiry: !!creds.expiry,
      tieneClientId: !!creds.client_id,
      tieneClientSecret: !!creds.client_secret,
    });
  } catch (err) {
    logger.warn('Error al obtener credenciales Google', {
      userId,
      tipo,
      code: err.code,
      message: err.message,
    });
    if (err.code === 'INTEGRACION_NOT_FOUND' || err.code === 'INTEGRACION_INACTIVA') {
      throw new AppError(
        `Google ${tipo} no está conectado. Conectá tu cuenta desde la sección Integraciones del menú.`,
        'GOOGLE_NOT_CONNECTED',
        400
      );
    }
    throw err;
  }

  const efectivoClientId = creds.client_id || config.google.clientId;
  const efectivoClientSecret = creds.client_secret || config.google.clientSecret;

  if (!efectivoClientId || !efectivoClientSecret) {
    logger.error('Credenciales de Google Cloud faltantes', {
      userId,
      tipo,
      tieneClientIdAlmacenado: !!creds.client_id,
      tieneClientIdConfig: !!config.google.clientId,
      tieneClientSecretAlmacenado: !!creds.client_secret,
      tieneClientSecretConfig: !!config.google.clientSecret,
    });
    throw new AppError(
      'Configurá las credenciales de Google Cloud Console en la sección Integraciones.',
      'GOOGLE_CREDENTIALS_MISSING',
      400
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    efectivoClientId,
    efectivoClientSecret,
    config.google.redirectUri
  );
  const expiry = creds.expiry ? parseInt(creds.expiry, 10) : null;
  const expirado = expiry && Date.now() >= expiry - 60_000;

  if (expirado && creds.refresh_token) {
    try {
      const credentials = await refreshAndPersist(userId, creds.refresh_token, {
        clientId: efectivoClientId,
        clientSecret: efectivoClientSecret,
      });
      oauth2Client.setCredentials(credentials);
      logger.info('Token Google refrescado', { userId, tipo });
    } catch (_) {
      throw new AppError(
        'La sesión de Google expiró. Volvé a conectar tu cuenta desde Integraciones.',
        'GOOGLE_TOKEN_EXPIRED',
        401
      );
    }
  } else {
    oauth2Client.setCredentials({
      access_token: creds.access_token,
      refresh_token: creds.refresh_token,
      expiry_date: expiry,
    });
  }

  return oauth2Client;
}

module.exports = { getGoogleClient };
