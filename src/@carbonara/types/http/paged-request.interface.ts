import { BaseFilter } from "../base/base-filter.interface";

export interface PagedRequest extends BaseFilter {
    pagina?: number;
    quantidadePorPagina?: number;
    ultimoIdEncontrado?: number;
    totalItems?: number;
}