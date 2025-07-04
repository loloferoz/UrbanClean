import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Center, labelCenterType } from '../models';
import { CenterService } from '../center.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, mergeMap, tap } from 'rxjs';
import {
  ActionType,
  defaultAddress,
  TableAction,
  TableColumns,
} from '@app/shared/models';
import { BaseTableComponent } from '@app/shared/components/base-table/base-table.component';
import { HeaderTableComponent } from '@app/shared/components/header-table/header-table.component';
import { FilterTableComponent } from '@app/shared/components/filter-table/filter-table.component';
import { CenterDialogEditComponent } from '../center-dialog-edit/center-dialog-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '@app/core/services/snack-bar.service';
import { DeleteDialogComponent } from '@app/shared/components/delete-dialog/delete-dialog.component';
import { CenterDialogViewComponent } from '../center-dialog-view/center-dialog-view.component';

@Component({
  selector: 'app-center-list',
  standalone: true,
  imports: [BaseTableComponent, HeaderTableComponent, FilterTableComponent],
  templateUrl: './center-list.component.html',
  styleUrl: './center-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterListComponent implements OnInit {
  private readonly centerService = inject(CenterService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(SnackBarService);
  private readonly dialog = inject(MatDialog);

  iconCreate = 'add';
  labelCreate = $localize`:@@center.add:Add new Center`;

  private labelCenterType = labelCenterType;
  private _centers = signal<Center[]>([]);
  centers = computed(() =>
    this._centers().map(c => ({
      ...c,
      centerType: this.labelCenterType.get(c.centerType),
    }))
  );
  valueToFilter = signal<string>('');

  private readonly columns: string[] = [
    'name',
    'description',
    'centerType',
    'action',
  ];
  private readonly labels: string[] = [
    $localize`:@@word.name:Name`,
    $localize`:@@word.description:Description`,
    $localize`:@@word.center_type:Type of Center`,
    $localize`:@@word.action:Action`,
  ];
  private readonly sortables: string[] = ['name', 'description', 'centerType'];

  tableColumns: TableColumns = {
    columns: [...this.columns],
    labels: [...this.labels],
    sortables: [...this.sortables],
    chips: ['centerType'],
    actions: {
      update: true,
      view: true,
      delete: true,
    },
  };

  ngOnInit(): void {
    this.getAllCenters();
  }

  getAllCenters() {
    this.centerService
      .getAllCenters()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((centers: Center[]) => this._centers.set(centers))
      )
      .subscribe();
  }

  create() {
    const center = {
      name: '',
      description: '',
      centerType: '',
      address: defaultAddress,
    };
    this.getDialog(true, center);
  }

  public action(data: TableAction) {
    const center = this._centers().find(c => c.id === data?.id);
    switch (data.action) {
      case ActionType.VIEW: {
        this.dialog.open(CenterDialogViewComponent, {
          data: {
            center: center,
          },
          width: '420px',
        });
        return;
      }
      case ActionType.UPDATE: {
        this.getDialog(false, center);
        return;
      }
      case ActionType.DELETE: {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          data: {
            content: $localize`:@@center.delete:Are you sure you want to delete this Center?`,
          },
        });

        dialogRef
          .afterClosed()
          .pipe(
            filter(result => result === true),
            mergeMap(() => this.centerService.deleteCenter(data?.id))
          )
          .subscribe({
            next: () => {
              this.snackBar.showToast(
                $localize`:@@center.deleted:Deleted Center`
              );
              this.getAllCenters();
            },
            error: err => console.log('error', err),
          });
        return;
      }
      default:
        return;
    }
  }

  getDialog(isNew: boolean, center: Center | Omit<Center, 'id'> | undefined) {
    const dialogRef = this.dialog.open(CenterDialogEditComponent, {
      data: {
        isNew: isNew,
        center: center,
      },
      width: '480px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.snackBar.showToast($localize`:@@center.created:Created Center`);
        this.getAllCenters();
      }
      if (result === 'updated') {
        this.snackBar.showToast($localize`:@@center.updated:Updated Center`);
        this.getAllCenters();
      }
    });
  }
}
