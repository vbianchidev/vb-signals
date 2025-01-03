import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  Signal,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PagedResponse } from '../types/http';

@Component({
  selector: 'pricefy-scroll-cdk',
  standalone: true,
  imports: [CommonModule, CdkScrollable],
  styles: [
    `
      :host {
        .scroll-wrapper {
          max-height: 100%;
          overflow-y: auto;
        }
      }
    `,
  ],
  template: `
    <div
      class="scroll-wrapper"
      #scrollable
      cdkScrollable
      style="border: 1px solid red;"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class PricefyScrollCdk {
  readonly #destroyRef = inject(DestroyRef);
  readonly #scrollDispatcher = inject(ScrollDispatcher);

  @ViewChild(CdkScrollable) scrollable!: CdkScrollable;

  @Input() orientation: Signal<'start' | 'end'> = signal('start');
  @Input() pagination: Signal<
    Omit<PagedResponse<unknown>, 'itens'> | undefined
  > = signal(undefined);

  @Output() nextPage = new EventEmitter<void>();

  ngAfterViewInit() {
    this.#scrollDispatcher.register(this.scrollable);
    this.#scrollDispatcher
      .scrolled()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event) => this.onScroll(event as CdkScrollable));
  }

  ngOnDestroy() {
    this.#scrollDispatcher.deregister(this.scrollable);
  }

  onScroll(event: CdkScrollable): void {
    console.log(event);
    const element = event.getElementRef().nativeElement;
    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;

    if (scrollPosition >= scrollHeight * 0.8) {
      const pagination = this.pagination();
      if (pagination && !pagination.ultimaPagina) this.nextPage.emit();
    }
  }
}
