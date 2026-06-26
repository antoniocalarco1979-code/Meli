import { motion } from 'framer-motion'
import type { ArniaDetailView } from '../services/arniaDetailService'
import { ArniaHeader } from './ArniaHeader'
import { FloatingVisitButton } from './FloatingVisitButton'
import { HealthCard } from './HealthCard'
import { PhotoGallery } from './PhotoGallery'
import { ProductionCard } from './ProductionCard'
import { QueenCard } from './QueenCard'
import { TimelineCard } from './TimelineCard'
import { TrattamentiCard } from './TrattamentiCard'
import { UltimaVisitaCard } from './UltimaVisitaCard'
import './arnia-shared.css'
import './ArniaDetail.css'

type ArniaDetailProps = {
  data: ArniaDetailView
  onNuovaVisita: () => void
  onEdit?: () => void
}

export function ArniaDetail({ data, onNuovaVisita, onEdit }: ArniaDetailProps) {
  const { arnia, apiario, coverFoto, foto, detail } = data

  return (
    <>
      <motion.div
        className="arnia-premium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <ArniaHeader
          arnia={arnia}
          apiario={apiario}
          coverFoto={coverFoto}
          onEdit={onEdit}
        />

        <HealthCard health={detail.health} />
        <QueenCard queen={detail.queen} />
        <ProductionCard production={detail.production} />
        <UltimaVisitaCard visit={detail.ultimaVisita} />
        <TimelineCard visits={detail.visitTimeline} />
        <PhotoGallery photos={foto} />
        <TrattamentiCard trattamenti={detail.trattamenti} />
      </motion.div>

      <FloatingVisitButton onClick={onNuovaVisita} />
    </>
  )
}
