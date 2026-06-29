import { motion } from 'framer-motion'
import type { ArniaDetailView } from '../services/arniaDetailService'
import { ArniaAzioneConsigliata } from './ArniaAzioneConsigliata'
import { ArniaDetailHeader } from './ArniaDetailHeader'
import { ArniaStatusSummary } from './ArniaStatusSummary'
import { IniziaIspezioneButton } from './IniziaIspezioneButton'
import { PhotoGallery } from './PhotoGallery'
import { TimelineCard } from './TimelineCard'
import './arnia-shared.css'
import './ArniaDetail.css'

type ArniaDetailProps = {
  data: ArniaDetailView
  onIniziaIspezione: () => void
}

export function ArniaDetail({ data, onIniziaIspezione }: ArniaDetailProps) {
  const { arnia, foto, detail } = data

  return (
    <motion.div
      className="arnia-premium"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="arnia-premium__primary">
        <ArniaDetailHeader
          arnia={arnia}
          reginaColore={detail.queen.colore}
          salute={detail.salute}
        />

        <ArniaStatusSummary visit={detail.ultimaVisita} />

        <ArniaAzioneConsigliata visit={detail.ultimaVisita} />
      </div>

      <div className="arnia-premium__secondary">
        <PhotoGallery photos={foto} />
        <TimelineCard visits={detail.visitTimeline} />
      </div>

      <div className="arnia-premium__cta">
        <IniziaIspezioneButton onClick={onIniziaIspezione} />
      </div>
    </motion.div>
  )
}
