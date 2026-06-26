import { motion } from 'framer-motion'
import { Images } from 'lucide-react'
import type { Foto } from '../../../database/types'
import './PhotoGallery.css'

type PhotoGalleryProps = {
  photos: Foto[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  return (
    <motion.section
      className="photo-gallery meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Galleria fotografica"
    >
      <header className="photo-gallery__header">
        <Images size={24} strokeWidth={1.65} aria-hidden="true" />
        <h2 className="arnia-section-title">Galleria fotografica</h2>
        <span className="photo-gallery__count">{photos.length}</span>
      </header>

      <p className="photo-gallery__hint">Filtri in arrivo — tutte le foto dell&apos;arnia</p>

      {photos.length === 0 ? (
        <p className="photo-gallery__empty">Nessuna foto in galleria</p>
      ) : (
        <div className="photo-gallery__grid">
          {photos.map((photo, index) => (
            <motion.figure
              key={photo.id}
              className="photo-gallery__item"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              whileHover={{ scale: 1.02 }}
            >
              <img src={photo.path} alt="" className="photo-gallery__img" loading="lazy" />
            </motion.figure>
          ))}
        </div>
      )}
    </motion.section>
  )
}
