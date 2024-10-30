import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponse, PagedResponse } from '../../../@carbonara/types/http';
import { Campanha } from '../../../@carbonara/types/model/promo';

import { Observable, delay, of } from 'rxjs';
import {
  CampanhaStatus,
  HttpResponseCode,
} from '../../../@carbonara/types/enums';
import { CampanhaGetRequestParamsDto } from '../dtos/campanha-get-request-params.dto';

export abstract class CampanhaApiService {
  abstract get(
    campanhaGetRequestParamsDto: CampanhaGetRequestParamsDto
  ): Observable<HttpResponse<PagedResponse<Campanha>>>;
}

@Injectable()
export class CampanhaApiHttpService implements CampanhaApiService {
  private readonly uri: string = 'campanha';

  constructor(private http: HttpClient) {}

  get(
    campanhaGetRequestParamsDto: CampanhaGetRequestParamsDto
  ): Observable<HttpResponse<PagedResponse<Campanha>>> {
    return this.http.get<HttpResponse<PagedResponse<Campanha>>>(this.uri);
  }
}

@Injectable()
export class CampanhaApiInMemoryService implements CampanhaApiService {
  private CAMPANHAS: Campanha[] = this.gerarCampanhas(100);

  private gerarCampanhas(quantidade: number): Campanha[] {
    const campanhas: Campanha[] = [];

    for (let i = 1; i <= quantidade; i++) {
      campanhas.push({
        id: i,
        campanhaAgrupamentoId: i,
        dataInicial: new Date(),
        dataFinal: new Date(),
        dataAlteracaoStatus: new Date(),
        status: CampanhaStatus.andamento,
        descricao: `Campanha ${i}`,
      });
    }

    return campanhas;
  }

  get(
    campanhaGetRequestParamsDto: CampanhaGetRequestParamsDto
  ): Observable<HttpResponse<PagedResponse<Campanha>>> {
    const { pagina, quantidadePorPagina } = campanhaGetRequestParamsDto;

    const startIndex = (pagina! - 1) * quantidadePorPagina!;
    const endIndex = startIndex + quantidadePorPagina!;

    const campanhasPaginadas = this.CAMPANHAS.slice(startIndex, endIndex);
    const totalItens = this.CAMPANHAS.length;
    const quantidadePaginas = Math.ceil(totalItens / quantidadePorPagina!);

    return of<HttpResponse<PagedResponse<Campanha>>>({
      responseCode: HttpResponseCode.OK,
      responseMessage: 'OK',
      numeroExcucao: 0,
      content: {
        totalItens,
        totalItensPagina: campanhasPaginadas.length,
        paginaAtual: pagina!,
        ultimoId: campanhasPaginadas[campanhasPaginadas.length - 1]?.id || 0,
        quantidadePaginas,
        itens: campanhasPaginadas,
        primeiraPagina: pagina! === 1,
        ultimaPagina: pagina! === quantidadePaginas,
      },
    }).pipe(delay(200)); // Adiciona um delay de 200ms para simular tempo de resposta
  }
}
