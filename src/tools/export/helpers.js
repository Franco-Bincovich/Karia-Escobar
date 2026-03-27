// tools/export/helpers.js
// Helpers de construcción de párrafos compartidos por todos los builders.

const { Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = require('docx');

/**
 * Crea un párrafo de texto con opciones de estilo configurables.
 *
 * @param {string} texto - Contenido del párrafo
 * @param {{ size?: number, bold?: boolean, spacingAfter?: number, alignment?: string }} [opts={}]
 * @returns {import('docx').Paragraph}
 */
function parrafoTexto(texto, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text: texto, size: opts.size || 24, bold: opts.bold || false })],
    spacing: { after: opts.spacingAfter !== undefined ? opts.spacingAfter : 120 },
    alignment: opts.alignment || AlignmentType.LEFT,
  });
}

/**
 * Crea un párrafo de título centrado (Heading 1).
 *
 * @param {string} texto - Texto del título
 * @returns {import('docx').Paragraph}
 */
function parrafoTitulo(texto) {
  return new Paragraph({
    text: texto,
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 240 },
    alignment: AlignmentType.CENTER,
  });
}

/**
 * Crea un párrafo con un label en negrita seguido de un valor.
 *
 * @param {string} label - Etiqueta en negrita (ej: "Destinatario")
 * @param {string} valor - Valor que acompaña al label
 * @returns {import('docx').Paragraph}
 */
function parrafoLabel(label, valor) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 24 }),
      new TextRun({ text: valor || '', size: 24 }),
    ],
    spacing: { after: 80 },
  });
}

/**
 * Crea un párrafo separador con línea horizontal gris.
 *
 * @returns {import('docx').Paragraph}
 */
function separador() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '999999' } },
    spacing: { after: 160 },
  });
}

/**
 * Divide un bloque de texto en párrafos individuales (uno por línea no vacía).
 *
 * @param {string} contenido - Texto multilinea a dividir
 * @returns {import('docx').Paragraph[]}
 */
function lineasContenido(contenido) {
  return contenido
    .split('\n')
    .filter((linea) => linea.trim() !== '')
    .map((linea) => parrafoTexto(linea));
}

/**
 * Crea un párrafo con numeración manual (ej: "1. Texto del punto").
 *
 * @param {string} texto - Contenido del punto
 * @param {number} numero - Número del punto
 * @returns {import('docx').Paragraph}
 */
function parrafoNumerado(texto, numero) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${numero}. `, bold: true, size: 24 }),
      new TextRun({ text: texto, size: 24 }),
    ],
    spacing: { after: 120 },
  });
}

/**
 * Crea un párrafo de firma con línea de rúbrica y nombre.
 *
 * @param {string} nombre - Nombre del firmante
 * @returns {import('docx').Paragraph}
 */
function parrafoFirma(nombre) {
  return new Paragraph({
    children: [new TextRun({ text: `____________________________    ${nombre}`, size: 22 })],
    spacing: { after: 160 },
  });
}

module.exports = {
  parrafoTexto,
  parrafoTitulo,
  parrafoLabel,
  separador,
  lineasContenido,
  parrafoNumerado,
  parrafoFirma,
};
