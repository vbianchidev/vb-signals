import { DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, isObservable, of, retry, tap } from 'rxjs';
import { PagedResponse } from '../http';
import { BaseModel } from './base-model.interface';

function createEffect<T>(generator: (origin$: Subject<T>) => Observable<T>) {
  const destroyRef = inject(DestroyRef);
  const origin$ = new Subject<T>();
  generator(origin$).pipe(retry(), takeUntilDestroyed(destroyRef)).subscribe();
  return (observableOrValue: T | Observable<T>) => {
    const observable$ = isObservable(observableOrValue)
      ? observableOrValue.pipe(retry())
      : of(observableOrValue);
    return observable$
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((value: T) => origin$.next(value));
  };
}

export class BaseStore<T extends BaseModel> {
  private readonly state = {
    $list: signal<T[]>([]),
    $selected: signal<T | undefined>(undefined),
    $pagination: signal<Omit<PagedResponse<T>, 'itens'> | undefined>(undefined),
  } as const;

  readonly $list = this.state.$list.asReadonly();
  readonly $selected = this.state.$selected.asReadonly();
  readonly $pagination = this.state.$pagination.asReadonly();

  readonly $pagedList = computed(() => {
    const list = this.$list();
    const pagination = this.$pagination();
    return {
      ...pagination,
      itens: list,
    } as PagedResponse<T>;
  });

  readonly setList = createEffect<T[]>((action) =>
    action.pipe(
      tap((data) =>
        this.state.$list.update((list) => [...(list ?? []), ...data])
      )
    )
  );

  readonly resetList = createEffect((action) =>
    action.pipe(tap(() => this.state.$list.update(() => [])))
  );

  readonly create = createEffect<T>((action) =>
    action.pipe(
      tap((newList) =>
        this.state.$list.update((list) => [...(list ?? []), newList])
      )
    )
  );

  readonly setSelected = createEffect<T>((action) =>
    action.pipe(tap((data) => this.state.$selected.update(() => data)))
  );

  readonly updateSelected = createEffect<Partial<T>>((action) =>
    action.pipe(
      tap((data) => {
        this.state.$selected.update((item) => {
          return item ? {...item, ...data} : item;
        });
      })
    )
  );

  readonly resetSelected = createEffect<void>((action) =>
    action.pipe(tap(() => this.state.$selected.update(() => undefined)))
  );

  readonly setPagedList = createEffect<PagedResponse<T>>((action) =>
    action.pipe(
      tap((newList) => {
        this.state.$list.update((list) => [...(list || []), ...newList.itens]);
        this.state.$pagination.update((_) => ({
          paginaAtual: newList.paginaAtual,
          primeiraPagina: newList.primeiraPagina,
          quantidadePaginas: newList.quantidadePaginas,
          totalItens: newList.totalItens,
          totalItensPagina: newList.totalItensPagina,
          ultimaPagina: newList.ultimaPagina,
          ultimoId: newList.ultimoId,
        }));
      })
    )
  );

  readonly nextPage = createEffect<void>((action) =>
    action.pipe(
      tap(() => {
        const pagination = this.state.$pagination();
        if (pagination && !pagination.ultimaPagina) {
          this.state.$pagination.update((currentPagination) => {
            if (!currentPagination) return;
            return {
              ...currentPagination,
              paginaAtual: (currentPagination.paginaAtual || 1) + 1,
            };
          });
        }
      })
    )
  );
}
