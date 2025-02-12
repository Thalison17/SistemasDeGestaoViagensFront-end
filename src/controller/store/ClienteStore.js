<<<<<<< HEAD
import Cliente from '../../model/Cliente'
import ClienteController from '../ClienteController'
import { GenericStore } from './generic/GenericStore'

const clientes = [
    new Cliente('10','João','joao@gmail.com','27999999999','12345678900')
]

export const useClienteStore = () => {
  const genericStore = new GenericStore('cliente')
  genericStore.enableMock(async () => clientes)
  return genericStore.createStore(new ClienteController)
}
=======
import ClienteController from '../ClienteController'
import { GenericStore } from './generic/GenericStore'

export const useClienteStore = () => {
  const genericStore = new GenericStore('cliente')
  const store = genericStore.createStore(new ClienteController())

  store.fetchById = async (id) => {
    return await store.controller.fetchById(id)
  }

  return store
}
>>>>>>> 2926bb1 (Salvando alterações locais antes de mudar de branch)
