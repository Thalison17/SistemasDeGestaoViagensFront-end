import Viagem from '../../model/Viagem'
import ViagemController from '../ViagemController'
import { GenericStore } from './generic/GenericStore'


export const useViagemStore = () => {
  const genericStore = new GenericStore('viagem')
  genericStore.enableMock(async () => viagens)
  return genericStore.createStore(new ViagemController())
}
