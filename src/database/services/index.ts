export {
  countApiari,
  createApiario,
  deleteApiario,
  deleteArniaWithRelations,
  getAllApiari,
  getApiarioById,
  sumNumeroArnie,
  updateApiario,
} from './apiariService'

export {
  createArnia,
  deleteArnia,
  getAllArnie,
  getArniaById,
  getArniaByPublicUuid,
  getArniaByQrCode,
  getArnieByApiarioId,
  regenerateArniaQr,
  syncApiarioArnieCount,
  updateArnia,
} from './arnieService'

export {
  createFoto,
  deleteFoto,
  getFotoByApiarioId,
  getFotoByArniaId,
  getFotoByVisitaId,
  updateFoto,
} from './fotoService'

export {
  createProduzione,
  createSmielatura,
  deleteProduzione,
  getAllSmielature,
  getProduzioneAnnoCorrenteKg,
  getProduzioneByArniaId,
  getProduzioneById,
  getSmielatureByApiarioId,
  syncApiarioProduzioneTotals,
  updateProduzione,
} from './produzioneService'

export {
  createRegina,
  getAllRegine,
  getReginaAttuale,
  getReginaById,
  getRegineByArniaId,
  impostaReginaAttuale,
  sostituisciRegina,
  updateRegina,
} from './regineService'

export {
  createTrattamento,
  deleteTrattamento,
  getAllTrattamenti,
  getTrattamentiByArniaId,
  getTrattamentiInScadenzaEntro,
  getTrattamentiPromemoriaProgrammati,
  getTrattamentoById,
  updateTrattamento,
} from './trattamentiService'

export {
  createVisita,
  deleteVisita,
  getVisitaById,
  getVisiteByArniaId,
  updateVisita,
} from './visiteService'
