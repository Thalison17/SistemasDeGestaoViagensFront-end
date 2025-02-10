import Destino from '../../model/Destino'
import DestinoController from '../DestinoController'
import { GenericStore } from './generic/GenericStore'

const destinos = [
  new Destino('1', 'Praia do Forte', 'Brasil', 150),
  new Destino('2', 'Paris', 'França', 200),
  new Destino('3', 'Nova York', 'Estados Unidos', 300),
]

export const useDestinoStore = () => {
  const genericStore = new GenericStore('destino')
  genericStore.enableMock(async () => destinos)
  return genericStore.createStore(new DestinoController())
}
