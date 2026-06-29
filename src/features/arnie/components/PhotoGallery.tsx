import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'
import { EmptyState } from '../../../components/ui/EmptyState/EmptyState'
import type { Foto } from '../../../database/types'
import './PhotoGallery.css'

type PhotoGalleryProps = {
  photos: Foto[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  return (
    <motion.section
      className="photo-gallery photo-gallery--secondary meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Foto arnia"
    >
      <header className="photo-gallery__header">
        <h2 className="arnia-section-title">Foto</h2>
        {photos.length > 0 && (
          <span className="photo-gallery__count">{photos.length}</span>
        )}
      </header>

      {photos.length === 0 ? (
        <EmptyState
          title="Nessuna foto disponibile"
          icon={<Camera size={40} strokeWidth={1.5} />}
        />
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
