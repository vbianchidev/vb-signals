import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  Signal,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PagedResponse } from '../types/http';

@Component({
  selector: 'pricefy-scroll',
  standalone: true,
  imports: [CommonModule, CdkScrollable],
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
    <div class="scroll-wrapper" cdkScrollable style="border: 1px solid red;">
      <ng-content></ng-content>
    </div>
  `,
})
export class PricefyScroll {
  readonly #destroyRef = inject(DestroyRef);
  readonly #scrollDispatcher = inject(ScrollDispatcher);

  @Input() orientation: Signal<'start' | 'end'> = signal('start');
  @Input() pagination: Signal<
    Omit<PagedResponse<unknown>, 'itens'> | undefined
  > = signal(undefined);

  @Output() nextPage = new EventEmitter<void>();

  ngOnInit() {
    this.#scrollDispatcher
      .scrolled()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event) => this.onScroll(event as CdkScrollable));
  }

  onScroll(event: CdkScrollable): void {
    const element = event.getElementRef().nativeElement;
    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;
    if (scrollPosition >= scrollHeight * 0.8) {
      const pagination = this.pagination();
      if (pagination && !pagination.ultimaPagina) this.nextPage.emit();
    }
  }
}
