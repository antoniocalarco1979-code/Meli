import QRCode from 'react-qr-code'
import './MeliQrCode.css'

type MeliQrCodeProps = {
  value: string
  size?: number
  title?: string
}

/** QR Code React — rendering SVG da payload permanente arnia. */
export function MeliQrCode({ value, size = 220, title = 'QR Code MELI' }: MeliQrCodeProps) {
  return (
    <div className="meli-qr-code" role="img" aria-label={title}>
      <QRCode
        value={value}
        size={size}
        level="M"
        bgColor="#ffffff"
        fgColor="#1c1c1e"
        title={title}
      />
    </div>
  )
}
