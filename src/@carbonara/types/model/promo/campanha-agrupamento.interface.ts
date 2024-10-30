import { BaseModel } from "../../base/base-model.interface";
import { Campanha } from "./campanha.interface";

export interface CampanhaAgrupamento extends BaseModel {
    descricao: string;
    descricaoCampanha: string;
    dataInicial: Date;
    dataFinal: Date;
    usuarioId: number;
    campanhaCategoriaId?: number;
    campanhas: Campanha[];
}
