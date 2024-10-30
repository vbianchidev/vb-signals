import { ItemFilter, ItemOrder } from '../enums';

export interface BaseFilter {
  usarEscopoCliente?: boolean;
  ativosInativos?: ItemFilter;
  ordemItens?: ItemOrder;
}
