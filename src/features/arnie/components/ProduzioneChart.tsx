import './ProduzioneChart.css'

type ProduzioneChartProps = {
  data: { mese: string; kg: number }[]
}

export function ProduzioneChart({ data }: ProduzioneChartProps) {
  const max = Math.max(...data.map((d) => d.kg), 1)

  if (data.length === 0) {
    return <p className="produzione-chart__empty">Nessun dato di produzione</p>
  }

  return (
    <div className="produzione-chart" role="img" aria-label="Grafico produzione mensile">
      <div className="produzione-chart__bars">
        {data.map((item) => (
          <div key={item.mese} className="produzione-chart__col">
            <span className="produzione-chart__value">{item.kg} kg</span>
            <div className="produzione-chart__track">
              <div
                className="produzione-chart__bar"
                style={{ height: `${(item.kg / max) * 100}%` }}
              />
            </div>
            <span className="produzione-chart__label">{item.mese}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
