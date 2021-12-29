import { DecimalPipe } from '@angular/common';
import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from 'src/app/header-sortable.directive';
import { JsonReader } from './json-reader';
import { Result } from './result';

interface SearchResult {
  result: Result[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(result: Result[], column: SortColumn, direction: string): Result[] {
  if (direction === '' || column === '') {
    return result;
  } else {
    return [...result].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(result: Result, term: string, pipe: PipeTransform) {
  return result.driverName.toLowerCase().includes(term.toLowerCase())
    || result.chassis.toLowerCase().includes(term.toLowerCase())
    || result.engine.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(result.points).includes(term);
}
@Injectable({
  providedIn: 'root'
})
export class ResultService {
  RESULTS: Result[] = JsonReader.getJson('result.json');
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _result$ = new BehaviorSubject<Result[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(res => {
      this._result$.next(res.result);
      this._total$.next(res.total);
    });

    this._search$.next();
  }

  get result$() { return this._result$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
    let result = sort(this.RESULTS, sortColumn, sortDirection);

    // 2. filter
    result = result.filter(res => matches(res, searchTerm, this.pipe));
    const total = result.length;

    // 3. paginate
    result = result.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ result, total });
  }
}
