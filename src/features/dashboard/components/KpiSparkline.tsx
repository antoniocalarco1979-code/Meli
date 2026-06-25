type KpiSparklineProps = {
  index: number
}

const sparkPaths = [
  'M0,20 L8,16 L16,18 L24,10 L32,12 L40,4',
  'M0,12 L8,14 L16,8 L24,10 L32,16 L40,12',
  'M0,18 L8,10 L16,12 L24,6 L32,8 L40,2',
  'M0,16 L8,18 L16,14 L24,16 L32,10 L40,14',
  'M0,20 L8,18 L16,20 L24,14 L32,16 L40,10',
]

const sparkFills = [
  'M0,20 L8,16 L16,18 L24,10 L32,12 L40,4 L40,24 L0,24 Z',
  'M0,12 L8,14 L16,8 L24,10 L32,16 L40,12 L40,24 L0,24 Z',
  'M0,18 L8,10 L16,12 L24,6 L32,8 L40,2 L40,24 L0,24 Z',
  'M0,16 L8,18 L16,14 L24,16 L32,10 L40,14 L40,24 L0,24 Z',
  'M0,20 L8,18 L16,20 L24,14 L32,16 L40,10 L40,24 L0,24 Z',
]

export function KpiSparkline({ index }: KpiSparklineProps) {
  const i = index % sparkPaths.length

  return (
    <svg className="kpi-sparkline" viewBox="0 0 40 24" aria-hidden="true">
      <defs>
        <linearGradient id={`spark-fill-${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--meli-honey)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--meli-honey)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={sparkFills[i]} fill={`url(#spark-fill-${index})`} />
      <path
        d={sparkPaths[i]}
        fill="none"
        stroke="var(--meli-honey)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
