import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Element, labelElementType } from '../models';
import { ElementService } from '../element.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, mergeMap, tap } from 'rxjs';
import { ActionType, TableAction, TableColumns } from '@app/shared/models';
import { BaseTableComponent } from '@app/shared/components/base-table/base-table.component';
import { MatDialog } from '@angular/material/dialog';
import { ElementDialogEditComponent } from '../element-dialog-edit/element-dialog-edit.component';
import { HeaderTableComponent } from '@app/shared/components/header-table/header-table.component';
import { FilterTableComponent } from '@app/shared/components/filter-table/filter-table.component';
import { ElementDialogViewComponent } from '../element-dialog-view/element-dialog-view.component';
import { SnackBarService } from '@app/core/services/snack-bar.service';
import { DeleteDialogComponent } from '@app/shared/components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-element-list',
  standalone: true,
  imports: [BaseTableComponent, HeaderTableComponent, FilterTableComponent],
  templateUrl: './element-list.component.html',
  styleUrl: './element-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementListComponent implements OnInit {
  private readonly elementService = inject(ElementService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(SnackBarService);
  private readonly dialog = inject(MatDialog);

  iconCreate = 'add';
  labelCreate = $localize`:@@element.add:Add new Element`;

  private labelElementType = labelElementType;
  _elements = signal<Element[]>([]);
  elements = computed(() =>
    this._elements().map(e => ({
      ...e,
      image: e.image?.path,
      elementType: this.labelElementType.get(e.elementType),
    }))
  );
  valueToFilter = signal<string>('');

  private readonly columns: string[] = [
    'name',
    'description',
    'capacity',
    'elementType',
    'image',
    'action',
  ];

  private readonly labels: string[] = [
    $localize`:@@word.name:Name`,
    $localize`:@@word.description:Description`,
    $localize`:@@word.capacity:Capacity`,
    $localize`:@@word.element_type:Type of Element`,
    $localize`:@@word.image:Image`,
    $localize`:@@word.action:Action`,
  ];

  private readonly sortables: string[] = [
    'name',
    'description',
    'capacity',
    'elementType',
  ];

  tableColumns: TableColumns = {
    columns: [...this.columns],
    labels: [...this.labels],
    sortables: [...this.sortables],
    chips: ['elementType'],
    actions: {
      update: true,
      view: true,
      delete: true,
    },
  };

  ngOnInit(): void {
    this.getAllElements();
  }

  getAllElements() {
    this.elementService
      .getAllElements()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((elements: Element[]) => this._elements.set(elements))
      )
      .subscribe();
  }

  create() {
    this.getDialog(true, undefined);
  }

  public action(data: TableAction) {
    const element = this._elements().find(e => e.id === data?.id);
    switch (data.action) {
      case ActionType.VIEW: {
        this.dialog.open(ElementDialogViewComponent, {
          data: {
            element: element,
          },
          width: '450px',
        });
        return;
      }
      case ActionType.UPDATE: {
        this.getDialog(false, element);
        return;
      }
      case ActionType.DELETE: {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          data: {
            content: $localize`:@@element.delete:Are you sure you want to delete this Element?`,
          },
        });
        dialogRef
          .afterClosed()
          .pipe(
            filter(result => result === true),
            mergeMap(() => this.elementService.deleteElement(data?.id))
          )
          .subscribe({
            next: () => {
              this.snackBar.showToast(
                $localize`:@@element.deleted:Deleted Element`
              );
              this.getAllElements();
            },
            error: err => console.log('error', err),
          });

        return;
      }
      default:
        return;
    }
  }

  getDialog(isNew: boolean, element: Element | undefined) {
    const dialogRef = this.dialog.open(ElementDialogEditComponent, {
      data: {
        isNew: isNew,
        element: element,
      },
      width: '480px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.snackBar.showToast($localize`:@@element.created:Created Element`);
        this.getAllElements();
      }
      if (result === 'updated') {
        this.snackBar.showToast($localize`:@@element.updated:Updated Element`);
        this.getAllElements();
      }
    });
  }
}
