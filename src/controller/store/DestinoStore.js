import DestinoController from '../DestinoController'
import { GenericStore } from './generic/GenericStore'


export const useDestinoStore = () => {
  const genericStore = new GenericStore('destino')
  return genericStore.createStore(new DestinoController())
}
