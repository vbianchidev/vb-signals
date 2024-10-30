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
    $list: signal<T[] | undefined>(undefined),
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

  public readonly setList = createEffect<T[]>((_) =>
    _.pipe(
      tap((newList) => {
        this.state.$list.update((list) => [...(list ?? []), ...newList]);
      })
    )
  );

  public readonly create = createEffect<T>((_) =>
    _.pipe(
      tap((newList) => {
        this.state.$list.update((list) => [...(list ?? []), newList]);
      })
    )
  );

  public readonly setPagedList = createEffect<PagedResponse<T>>((_) =>
    _.pipe(
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

  public readonly nextPage = createEffect<void>((_) =>
    _.pipe(
      tap(() => {
        const pagination = this.state.$pagination();

        if (pagination && !pagination.ultimaPagina) {
          // Atualiza o estado da paginação com a próxima página
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
