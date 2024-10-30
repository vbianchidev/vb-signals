import { CampanhaStatus } from "../../enums/campanha-status.enum";
import { BaseModel } from "../../base/base-model.interface";
import { CampanhaAgrupamento } from "./campanha-agrupamento.interface";
import { CampanhaEstagios } from "./campanha-estagio.interface";

export interface Campanha extends BaseModel {
    campanhaAgrupamentoId: number;
    descricao: string;
    dataInicial: Date;
    dataFinal: Date;
    dataAlteracaoStatus?: Date;
    status: CampanhaStatus;

    readonly campanhaAgrupamento?: CampanhaAgrupamento;
    readonly campanhaEstagios?: CampanhaEstagios[];
}
