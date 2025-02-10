import Reserva from '../../model/Reserva'
import ReservaController from '../ReservaController'
import { GenericStore } from './generic/GenericStore'

export const useReservaStore = () => {
  const genericStore = new GenericStore('reserva')
  genericStore.enableMock(async () => reservas)
  return genericStore.createStore(new ReservaController())
}
