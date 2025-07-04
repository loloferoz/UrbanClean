import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActionType, TableAction, TableColumns } from '@app/shared/models';
import { ImagePathPipe } from '@app/shared/pipes/image-path.pipe';
import { Subject } from 'rxjs';

const MATERIAL_MODULES = [
  MatIcon,
  MatMenuModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatChipsModule,
  MatCardModule,
];

@Component({
  selector: 'app-base-table',
  standalone: true,
  imports: [FormsModule, ImagePathPipe, DatePipe, MATERIAL_MODULES],
  templateUrl: './base-table.component.html',
  styleUrl: './base-table.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: BaseTableComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseTableComponent<T> implements OnInit {
  data = input<T[]>([]);
  tableColumns = input.required<TableColumns>();
  valueFiltered = input<string>('');
  actionTable = output<TableAction>();

  dataSource = new MatTableDataSource<T>();

  private readonly sort = viewChild.required<MatSort>(MatSort);
  private readonly paginator = viewChild.required<MatPaginator>(MatPaginator);

  changes = new Subject<void>();
  itemsPerPageLabel = $localize`:@@table.itemsPerPageLabel:Items per page`;
  firstPageLabel = $localize`:@@table.firstPageLabel:First page`;
  lastPageLabel = $localize`:@@table.lastPageLabel:Last page`;

  nextPageLabel = $localize`:@@table.nextPageLabel:Next page`;
  previousPageLabel = $localize`:@@table.previousPageLabel:Previous page`;

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`:@@table.getRangeLabel.null:Page 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`:@@table.getRangeLabel.not_null:Page ${page + 1} of ${amountPages}`;
  }

  constructor() {
    effect(() => {
      if (this.valueFiltered()) {
        this.dataSource.filter = this.valueFiltered();
      } else {
        this.dataSource.filter = '';
      }

      if (this.data()) {
        this.dataSource.data = this.data();
      }
    });
  }

  ngOnInit(): void {
    this.dataSource.data = this.data();
    this.dataSource.sort = this.sort();
    this.dataSource.paginator = this.paginator();
  }

  public update(id: string) {
    this.actionTable.emit({ action: ActionType.UPDATE, id });
  }

  public view(id: string) {
    this.actionTable.emit({ action: ActionType.VIEW, id });
  }

  public delete(id: string) {
    this.actionTable.emit({ action: ActionType.DELETE, id });
  }
}
