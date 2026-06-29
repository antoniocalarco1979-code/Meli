import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'
import './ArniaPhotoHero.css'

type ArniaPhotoHeroProps = {
  coverFoto?: string
}

export function ArniaPhotoHero({ coverFoto }: ArniaPhotoHeroProps) {
  return (
    <motion.section
      className="arnia-photo-hero"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Foto arnia"
    >
      <h2 className="arnia-section-title arnia-section-title--inline">📷 Foto</h2>
      <div className="arnia-photo-hero__frame">
        {coverFoto ? (
          <img src={coverFoto} alt="" className="arnia-photo-hero__img" />
        ) : (
          <div className="arnia-photo-hero__placeholder">
            <Camera size={56} strokeWidth={1.1} aria-hidden="true" />
          </div>
        )}
      </div>
    </motion.section>
  )
}
