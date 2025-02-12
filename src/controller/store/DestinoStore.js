import DestinoController from '../DestinoController'
import { GenericStore } from './generic/GenericStore'

export const useDestinoStore = () => {
  const genericStore = new GenericStore('destino')
  const store = genericStore.createStore(new DestinoController())

  store.fetchById = async (id) => {
    return await store.controller.fetchById(id)
  }

  return store
}