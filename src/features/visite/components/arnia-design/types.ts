import type {
  TelainoApiPresentiChoice,
  TelainoCelleRealiChoice,
  TelainoCovataChoice,
  TelainoPollineChoice,
  TelainoProblemiChoice,
  TelainoReginaVistaChoice,
  TelainoScorteChoice,
} from '../../types/ispezioneWizard.types'

export type TelainoDesignStatus = 'pending' | 'inspected'

export type TelainoDesignData = {
  id: string
  numero: number
  status: TelainoDesignStatus
  covata: TelainoCovataChoice | null
  polline: TelainoPollineChoice | null
  scorteMiele: TelainoScorteChoice | null
  reginaVista: TelainoReginaVistaChoice | null
  celleReali: TelainoCelleRealiChoice | null
  apiPresenti: TelainoApiPresentiChoice | null
  problemi: TelainoProblemiChoice | null
  note: string
}

export type ArniaDesignMock = {
  arniaNumero: string
  telaiTotali: number
  telai: TelainoDesignData[]
}
