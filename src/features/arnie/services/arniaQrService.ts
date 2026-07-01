import QRCode from 'qrcode'
import { jsPDF } from 'jspdf'
import type { Arnia } from '../../../database/types'

/** Formato definitivo del payload QR. */
export const ARNIA_QR_URI_PREFIX = 'meli://arnia/'

/** Prefisso legacy — accettato in scansione per etichette già stampate. */
export const ARNIA_QR_PREFIX = 'meli:arnia:'

export type ArniaQrLabelContext = {
  arnia: Arnia
  apiarioNome?: string
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  )
}

/** Payload QR: esclusivamente `meli://arnia/{UUID}`. */
export function buildArniaQrPayload(publicUuid: string): string {
  return `${ARNIA_QR_URI_PREFIX}${publicUuid}`
}

/** Valore da codificare nel QR per un'arnia (preferisce qrCode persistito se valido). */
export function resolveArniaQrPayload(arnia: Pick<Arnia, 'publicUuid' | 'qrCode'>): string {
  const parsed = arnia.qrCode ? parseArniaQrPayload(arnia.qrCode) : null
  if (parsed === arnia.publicUuid) {
    return buildArniaQrPayload(arnia.publicUuid)
  }
  return buildArniaQrPayload(arnia.publicUuid)
}

/**
 * Estrae l'UUID permanente da un payload scansionato.
 * Accetta `meli://arnia/{uuid}`, prefisso legacy `meli:arnia:` e UUID raw.
 */
export function parseArniaQrPayload(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  if (trimmed.startsWith(ARNIA_QR_URI_PREFIX)) {
    const uuid = trimmed.slice(ARNIA_QR_URI_PREFIX.length).trim()
    return isUuid(uuid) ? uuid : null
  }

  if (trimmed.startsWith(ARNIA_QR_PREFIX)) {
    const uuid = trimmed.slice(ARNIA_QR_PREFIX.length).trim()
    return isUuid(uuid) ? uuid : null
  }

  if (isUuid(trimmed)) return trimmed

  return null
}

export async function generateQrImageDataUrl(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, {
    width: 512,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#1c1c1e', light: '#ffffff' },
  })
}

export async function buildArniaQrAssets(publicUuid: string) {
  const qrCode = buildArniaQrPayload(publicUuid)
  const qrImageDataUrl = await generateQrImageDataUrl(qrCode)
  return { qrCode, qrImageDataUrl }
}

async function resolveQrImage(arnia: Arnia): Promise<string> {
  const payload = resolveArniaQrPayload(arnia)
  if (arnia.qrImageDataUrl && arnia.qrCode === payload) {
    return arnia.qrImageDataUrl
  }
  return generateQrImageDataUrl(payload)
}

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}

export async function downloadArniaQrPng(context: ArniaQrLabelContext): Promise<void> {
  const qrImage = await resolveQrImage(context.arnia)
  triggerDownload(qrImage, `MELI-arnia-${context.arnia.publicUuid}.png`)
}

function buildLabelLines({ arnia, apiarioNome }: ArniaQrLabelContext) {
  const title = `Arnia ${arnia.numero}${arnia.nome?.trim() ? ` · ${arnia.nome.trim()}` : ''}`
  return {
    brand: 'MELI',
    apiario: apiarioNome?.trim() || 'Apiario',
    title,
    uuid: arnia.publicUuid,
  }
}

export async function downloadArniaQrPdf(context: ArniaQrLabelContext): Promise<void> {
  const qrImage = await resolveQrImage(context.arnia)
  const lines = buildLabelLines(context)
  const doc = new jsPDF({ unit: 'mm', format: 'a6', orientation: 'portrait' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(lines.brand, 10, 12)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(lines.apiario, 10, 18)
  doc.text(lines.title, 10, 24)

  doc.addImage(qrImage, 'PNG', 18, 30, 42, 42)

  doc.setFontSize(7)
  doc.text('UUID permanente', 10, 78)
  doc.setFont('courier', 'normal')
  doc.setFontSize(6)
  doc.text(lines.uuid, 10, 82, { maxWidth: 78 })

  doc.save(`MELI-arnia-${context.arnia.publicUuid}.pdf`)
}

export async function printArniaQrLabel(context: ArniaQrLabelContext): Promise<void> {
  const qrImage = await resolveQrImage(context.arnia)
  const lines = buildLabelLines(context)
  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <title>Etichetta MELI · Arnia ${context.arnia.numero}</title>
  <style>
    @page { size: 100mm 70mm; margin: 6mm; }
    body { font-family: system-ui, sans-serif; color: #1c1c1e; margin: 0; }
    .label { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
    .brand { font-weight: 800; letter-spacing: 0.18em; font-size: 14px; }
    .meta { font-size: 11px; color: #555; }
    img { width: 42mm; height: 42mm; }
    .uuid { font-family: ui-monospace, monospace; font-size: 8px; word-break: break-all; max-width: 88mm; }
  </style>
</head>
<body>
  <div class="label">
    <div class="brand">MELI</div>
    <div class="meta">${lines.apiario}</div>
    <div class="meta">${lines.title}</div>
    <img src="${qrImage}" alt="QR Code arnia" />
    <div class="uuid">${lines.uuid}</div>
  </div>
  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); };</script>
</body>
</html>`

  const popup = window.open('', '_blank', 'noopener,noreferrer,width=480,height=640')
  if (!popup) {
    throw new Error('Impossibile aprire la finestra di stampa. Consenti i popup per MELI.')
  }
  popup.document.open()
  popup.document.write(html)
  popup.document.close()
}
