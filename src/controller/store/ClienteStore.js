import ClienteController from '../ClienteController'
import { GenericStore } from './generic/GenericStore'

export const useClienteStore = () => {
  const genericStore = new GenericStore('cliente')
  return genericStore.createStore(new ClienteController())
}
