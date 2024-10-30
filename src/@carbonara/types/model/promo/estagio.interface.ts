import { BaseModel } from "../../base/base-model.interface";

export interface Estagio  extends BaseModel {
    codigo: string;
    descricao: string;
    ordem: number;
    fixo: boolean;
    ativo: boolean;
    cor?: string;
}
