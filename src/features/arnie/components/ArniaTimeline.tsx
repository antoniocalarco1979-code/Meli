import type { TimelineItem } from '../types'
import './ArniaTimeline.css'

type ArniaTimelineProps = {
  items: TimelineItem[]
}

export function ArniaTimeline({ items }: ArniaTimelineProps) {
  if (items.length === 0) {
    return <p className="arnia-timeline__empty">Nessun evento registrato</p>
  }

  return (
    <ol className="arnia-timeline">
      {items.map((item, index) => (
        <li key={item.id} className="arnia-timeline__item">
          <div className="arnia-timeline__dot" aria-hidden="true">
            {index === 0 && <span className="arnia-timeline__dot-pulse" />}
          </div>
          <div className="arnia-timeline__content">
            <time className="arnia-timeline__date">
              {new Date(item.data).toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'short',
              })}
            </time>
            <p className="arnia-timeline__title">{item.titolo}</p>
            {item.sottotitolo && <p className="arnia-timeline__sub">{item.sottotitolo}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
