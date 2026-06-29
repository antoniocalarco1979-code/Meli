import type { ArniaDesignMock, TelainoDesignData } from './types'

function createMockTelaino(numero: number, status: TelainoDesignData['status'] = 'pending'): TelainoDesignData {
  return {
    id: `mock-telaino-${numero}`,
    numero,
    status,
    covata: null,
    polline: null,
    scorteMiele: null,
    reginaVista: null,
    celleReali: null,
    apiPresenti: null,
    problemi: null,
    note: '',
  }
}

/** Dati temporanei per validazione UX — nessuna persistenza. */
export function createMockArniaDesign(arniaNumero = '12', telaiTotali = 10): ArniaDesignMock {
  const telai = Array.from({ length: telaiTotali }, (_, index) => createMockTelaino(index + 1))

  // Due telaini già ispezionati per mostrare stati colore in anteprima
  telai[0] = {
    ...telai[0],
    status: 'inspected',
    covata: 'buona',
    polline: 'buono',
    scorteMiele: 'buone',
    reginaVista: 'no',
    celleReali: 'assenti',
    apiPresenti: 'normali',
    problemi: 'nessuno',
  }
  telai[1] = {
    ...telai[1],
    status: 'inspected',
    covata: 'poca',
    polline: 'poco',
    scorteMiele: 'poche',
    reginaVista: 'no',
    celleReali: 'assenti',
    apiPresenti: 'poche',
    problemi: 'nessuno',
  }

  return { arniaNumero, telaiTotali, telai }
}
