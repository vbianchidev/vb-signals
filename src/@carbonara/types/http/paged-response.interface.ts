export interface PagedResponse<T> {
    totalItens: number;
    totalItensPagina: number;
    paginaAtual: number;
    ultimoId: number;
    quantidadePaginas: number;
    itens: T[];
    primeiraPagina: boolean;
    ultimaPagina: boolean;
}