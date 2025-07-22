import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HiredServiceService } from '../hired-service.service';
import {
  HiredService,
  HiredServiceType,
  labelHiredServiceType,
} from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, mergeMap, tap } from 'rxjs';
import { BaseTableComponent } from '@app/shared/components/base-table/base-table.component';
import { ActionType, TableAction, TableColumns } from '@app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { HiredServiceDialogEditComponent } from '../hired-service-dialog-edit/hired-service-dialog-edit.component';
import { FilterTableComponent } from '@app/shared/components/filter-table/filter-table.component';
import { HeaderTableComponent } from '@app/shared/components/header-table/header-table.component';
import { HiredServiceDialogWiewComponent } from '../hired-service-dialog-wiew/hired-service-dialog-wiew.component';
import { SnackBarService } from '@app/core/services/snack-bar.service';
import { DeleteDialogComponent } from '@app/shared/components/delete-dialog/delete-dialog.component';
import { AuthService } from '@app/features/auth/auth.service';
import { UserRole } from '@app/features/user/models';

@Component({
  selector: 'app-hired-service-list',
  standalone: true,
  imports: [BaseTableComponent, HeaderTableComponent, FilterTableComponent],
  templateUrl: './hired-service-list.component.html',
  styleUrl: './hired-service-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HiredServiceListComponent implements OnInit {
  private readonly hiredServiceService = inject(HiredServiceService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(SnackBarService);
  private readonly dialog = inject(MatDialog);

  readonly isAdmin =
    inject(AuthService).authStatus().userRole === UserRole.ADMIN;

  iconCreate = 'add';
  labelCreate = $localize`:@@hired_service.add:Add new Service`;

  labelHiredServiceType = labelHiredServiceType;
  _hiredServices = signal<HiredService[]>([]);
  hiredServices = computed(() =>
    this._hiredServices().map(hs => ({
      ...hs,
      hiredServiceType: this.labelHiredServiceType.get(hs.hiredServiceType),
    }))
  );
  valueToFilter = signal<string>('');

  columns: string[] = ['name', 'description', 'hiredServiceType'];

  labels: string[] = [
    $localize`:@@word.name:Name`,
    $localize`:@@word.description:Description`,
    $localize`:@@word.hired_service_type:Type of Service`,
  ];
  sortables: string[] = ['name', 'description', 'hiredServiceType'];

  tableColumns: TableColumns = {
    columns: [...this.columns],
    labels: [...this.labels],
    sortables: [...this.sortables],
    chips: ['hiredServiceType'],
    actions: {
      update: true,
      view: false,
      delete: true,
    },
  };

  ngOnInit(): void {
    this.getAllHiredServices();
    if (this.isAdmin) {
      this.tableColumns.columns.push('action');
      this.tableColumns.labels.push($localize`:@@word.action:Action`);
    }
  }

  getAllHiredServices() {
    this.hiredServiceService
      .getAllHiredServices()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((hiredServices: HiredService[]) =>
          this._hiredServices.set(hiredServices)
        )
      )
      .subscribe();
  }

  create() {
    const hiredService = {
      name: '',
      description: '',
      hiredServiceType: HiredServiceType.OTHER,
    };
    this.getDialog(true, hiredService);
  }

  public action(data: TableAction) {
    const hiredService = this._hiredServices().find(hs => hs.id === data?.id);
    switch (data.action) {
      case ActionType.VIEW: {
        this.dialog.open(HiredServiceDialogWiewComponent, {
          data: {
            hiredService: hiredService,
          },
        });
        return;
      }
      case ActionType.UPDATE: {
        this.getDialog(false, hiredService);
        return;
      }
      case ActionType.DELETE: {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          data: {
            content: $localize`:@@hired_service.delete:Are you sure you want to delete this Service?`,
          },
        });

        dialogRef
          .afterClosed()
          .pipe(
            filter(result => result === true),
            mergeMap(() =>
              this.hiredServiceService.deleteHiredService(data?.id)
            )
          )
          .subscribe({
            next: () => {
              this.snackBar.showToast(
                $localize`:@@hired_service.deleted:Deleted Service`
              );
              this.getAllHiredServices();
            },
            error: err => console.log('error', err),
          });
        return;
      }
      default:
        return;
    }
  }

  getDialog(
    isNew: boolean,
    hiredService: HiredService | Omit<HiredService, 'id'> | undefined
  ) {
    const dialogRef = this.dialog.open(HiredServiceDialogEditComponent, {
      data: {
        isNew: isNew,
        hiredService: hiredService,
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.snackBar.showToast(
          $localize`:@@hired_service.created:Created Service`
        );
        this.getAllHiredServices();
      }
      if (result === 'updated') {
        this.snackBar.showToast(
          $localize`:@@hired_service.updated:Updated Service`
        );
        this.getAllHiredServices();
      }
    });
  }
}
