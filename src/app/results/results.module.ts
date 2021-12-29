import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ResultsComponent } from './results.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderSortableDirective } from '../header-sortable.directive';


@NgModule({
  declarations: [ResultsComponent, HeaderSortableDirective],
  imports: [
    CommonModule,
    FormsModule,
    ResultsRoutingModule,
    NgbModule,
    ReactiveFormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ResultsModule { }
