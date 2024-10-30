import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  Signal,
  signal,
} from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { PagedResponse } from '../types/http';

@Component({
  selector: 'pricefy-scroll',
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective],
  styles: [
    `
      :host {
        display: flex;
        height: 100%;
        width: 100%;

        .scroll-wrapper {
          max-height: 100%;
          overflow-y: scroll;
        }
      }
    `,
  ],
  template: `
    <div
      class="scroll-wrapper"
      infiniteScroll
      [infiniteScrollDistance]="0.8"
      [infiniteScrollThrottle]="pagination()?.totalItens || 1000"
      [alwaysCallback]="false"
      [scrollWindow]="false"
      [fromRoot]="true"
      (scrolled)="onScroll()"
      style="border: 1px solid red;"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class PricefyScroll {
  @Input() orientation: Signal<'start' | 'end'> = signal('start');
  @Input() pagination: Signal<
    Omit<PagedResponse<unknown>, 'itens'> | undefined
  > = signal(undefined);

  @Output() nextPage = new EventEmitter<void>();

  onScroll(): void {
    const pagination = this.pagination();
    if (pagination && !pagination.ultimaPagina) this.nextPage.emit();
  }
}
