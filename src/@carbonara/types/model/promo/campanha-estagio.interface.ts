import { CampanhaStatus } from "../../enums/campanha-status.enum";
import { BaseModel } from "../../base/base-model.interface";
import { Campanha } from "./campanha.interface";
import { Estagio } from "./estagio.interface";

export interface CampanhaEstagios extends BaseModel {
    campanhaId: string;
    estagioId: number;
    dataInicial?: Date;
    dataFinal?: Date;
    ordem: number;
    status: CampanhaStatus;
    campanha?: Campanha;
    estagio?: Estagio;
    workflowTemplateId: number;
    estagios: CampanhaEstagios[];
    readonly descricaoEstagio?: string;
    readonly corEstagio?: string;
}
