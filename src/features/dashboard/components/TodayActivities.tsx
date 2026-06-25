import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import type { TodayActivity } from '../types'
import './TodayActivities.css'

type TodayActivitiesProps = {
  activities: TodayActivity[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.35 },
  },
}

const item = {
  hidden: { opacity: 0, x: 14 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function TodayActivities({ activities }: TodayActivitiesProps) {
  return (
    <motion.section
      className="today-activities meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ boxShadow: 'var(--meli-shadow-lg)' }}
      aria-label="Attività di oggi"
    >
      <header className="today-activities__header">
        <CalendarDays size={24} strokeWidth={1.65} aria-hidden="true" />
        <h2 className="today-activities__title">Attività di oggi</h2>
        <span className="today-activities__badge">{activities.length}</span>
      </header>

      <div className="today-activities__timeline">
        <span className="today-activities__line" aria-hidden="true" />

        <motion.ol className="today-activities__list" variants={container} initial="hidden" animate="show">
          {activities.map((activity, index) => (
            <motion.li
              key={activity.id}
              className="today-activities__item"
              variants={item}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
            >
              <div className="today-activities__node-wrap">
                <span
                  className={`today-activities__node${index === 0 ? ' today-activities__node--active' : ''}`}
                  aria-hidden="true"
                />
              </div>
              <div className="today-activities__card">
                <time className="today-activities__time">{activity.time}</time>
                <p className="today-activities__text">{activity.title}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </motion.section>
  )
}
