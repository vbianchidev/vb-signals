import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';
import { CampanhaGetRequestParamsDto } from '../dtos/campanha-get-request-params.dto';
import { CampanhaApiService } from './campanha-api.service';
import { CampanhaStoreService } from './campanha-store.service';

@Injectable()
export class CampanhaFacadeService {
  private readonly campanhaApiService = inject(CampanhaApiService);
  private readonly campanhaStoreService = inject(CampanhaStoreService);

  readonly $pagination = this.campanhaStoreService.$pagination;
  readonly $paged = this.campanhaStoreService.$pagedList;
  readonly $campanhaSelecionada = this.campanhaStoreService.$selected;

  getAllCampanhas(
    campanhaGetRequestParamsDto: CampanhaGetRequestParamsDto
  ): void {
    // this.campanhaStoreService.setPagedList(
    //   this.campanhaApiService.get(campanhaGetRequestParamsDto).pipe(map(res => res.content))
    // )
    this.campanhaApiService
      .get(campanhaGetRequestParamsDto)
      .pipe(tap((res) => this.campanhaStoreService.setPagedList(res.content)))
      .subscribe();
  }

  getNextPage(): void {
    this.campanhaStoreService.nextPage();
  }
}
