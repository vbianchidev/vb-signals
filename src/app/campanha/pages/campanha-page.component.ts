import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { PricefyScroll } from '../../../@carbonara/components/pricefy-scroll.component';
import {
  CampanhaApiInMemoryService,
  CampanhaApiService,
} from '../providers/campanha-api.service';
import { CampanhaFacadeService } from '../providers/campanha-facade.service';
import { CampanhaStoreService } from '../providers/campanha-store.service';
import { PricefyScrollCdk } from '@carbonara/components/pricefy-scroll-cdk.component';

@Component({
  selector: 'promo-campanha-page',
  standalone: true,
  imports: [JsonPipe, PricefyScrollCdk],
  styles: `
    pricefy-scroll {
      height: 350px !important; 
      max-height: 550px;
      display: flex;
      flex-direction: column;
      border: 1px solid green;
    }
  `,
  template: `
    <pricefy-scroll-cdk [pagination]="$paginacao" (nextPage)="getPage()">
      @for (campanha of $campanhas().itens; track $index) {
      <h1>{{ campanha.descricao }}</h1>
      }
    </pricefy-scroll-cdk>
  `,
  providers: [
    CampanhaFacadeService,
    CampanhaStoreService,
    { provide: CampanhaApiService, useClass: CampanhaApiInMemoryService },
  ],
})
export class CampanhaPageComponent implements OnInit {
  private readonly campanhaFacadeService = inject(CampanhaFacadeService);

  $campanhas = this.campanhaFacadeService.$paged;
  $paginacao = this.campanhaFacadeService.$pagination;

  ngOnInit(): void {
    this.getPage();
  }

  getPage(): void {
    this.campanhaFacadeService.getNextPage();
    const paginantion = this.$paginacao();
    this.campanhaFacadeService.getAllCampanhas({
      pagina: paginantion?.paginaAtual || 1,
      quantidadePorPagina: paginantion?.totalItensPagina || 10,
    });
  }
}
