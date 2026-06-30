import { useRef } from 'react'
import { motion } from 'framer-motion'
import type { ArniaDetailView } from '../services/arniaDetailService'
import { ArniaAzioneConsigliata } from './ArniaAzioneConsigliata'
import { ArniaDetailHeader } from './ArniaDetailHeader'
import { ArniaConfigSection } from './detail/ArniaConfigSection'
import { ArniaDetailQrStrip } from './detail/ArniaDetailQrStrip'
import { ArniaDetailVisitCta } from './detail/ArniaDetailVisitCta'
import { ArniaStatusSummary } from './ArniaStatusSummary'
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
  const timelineRef = useRef<HTMLDivElement>(null)

  const scrollToTimeline = () => {
    timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.div
      className="arnia-premium"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="arnia-premium__hero">
        <ArniaDetailHeader
          arnia={arnia}
          reginaColore={detail.queen.colore}
          salute={detail.salute}
        />

        <ArniaDetailQrStrip arnia={arnia} apiarioNome={data.apiario?.nome} />

        <ArniaDetailVisitCta onClick={onIniziaIspezione} />
      </div>

      <div className="arnia-premium__primary">
        <ArniaConfigSection arnia={arnia} />

        <ArniaStatusSummary visit={detail.ultimaVisita} onCellClick={scrollToTimeline} />

        <ArniaAzioneConsigliata visit={detail.ultimaVisita} />
      </div>

      <div className="arnia-premium__secondary" ref={timelineRef} id="arnia-timeline">
        <PhotoGallery photos={foto} />
        <TimelineCard visits={detail.visitTimeline} />
      </div>
    </motion.div>
  )
}
