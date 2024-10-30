import { CampanhaStatus } from '../../../@carbonara/types/enums';
import { PagedRequest } from '../../../@carbonara/types/http';

export interface CampanhaGetRequestParamsDto extends PagedRequest {
  readonly id?: number;
  readonly campanhaAgrupamentoId?: number;
  readonly estagioId?: number;
  readonly estagioStatus?: CampanhaStatus;
  readonly descricao?: string;
  readonly dataInicial?: Date;
  readonly dataFinal?: Date;
  readonly expandirEstagios?: boolean;
  readonly expandirOfertas?: boolean;
  readonly status?: CampanhaStatus;
  readonly expandirAgrupamento?: boolean;
}
