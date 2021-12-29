import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/assets/helpers/result';
import { ResultService } from 'src/assets/helpers/result.service';
import { HeaderSortableDirective, SortEvent } from '../header-sortable.directive';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  providers: [ResultService, DecimalPipe]
})
export class ResultsComponent implements OnInit {
  result$: Observable<Result[]>;
  total$: Observable<number>;

  @ViewChildren(HeaderSortableDirective) headers: QueryList<HeaderSortableDirective>;
  constructor(public service: ResultService) {
    this.result$ = service.result$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
  }


  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
