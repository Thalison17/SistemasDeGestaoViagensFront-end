import { Cliente } from '@/model/Cliente'
import ClienteController from '../ClienteController'
import { GenericStore } from './generic/GenericStore'

// const clienteController = new ClienteController()
const genericStore = new GenericStore<Cliente>('cliente')

const clientes = [
    new Cliente('10','João','joao@gmail.com','27999999999','12345678900')
]

genericStore.enableMock(async () => clientes)
export const useClienteStore = genericStore.createStore(ClienteController)