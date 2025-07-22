import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WorkDayService } from '../work-day.service';
import { WorkDay } from '../models';
import { ActionType, TableAction, TableColumns } from '@app/shared/models';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, mergeMap, tap } from 'rxjs';
import { WorkDayDialogEditComponent } from '../work-day-dialog-edit/work-day-dialog-edit.component';
import { defaultUser, User, UserRole } from '@app/features/user/models';
import {
  defaultHiredService,
  HiredService,
} from '@app/features/hired-service/models';
import { defaultSector } from '@app/features/sector/models';
import { WorkDayDialogViewComponent } from '../work-day-dialog-view/work-day-dialog-view.component';
import { SnackBarService } from '@app/core/services/snack-bar.service';
import { HiredServiceService } from '@app/features/hired-service/hired-service.service';
import { UserService } from '@app/features/user/user.service';
import { DeleteDialogComponent } from '@app/shared/components/delete-dialog/delete-dialog.component';
import { FormControl } from '@angular/forms';
import { ResponsiveService } from '@app/core/services/responsive.service';
import { HeaderWorkDayComponent } from '../header-work-day/header-work-day.component';
import { BaseTableComponent } from '@app/shared/components/base-table/base-table.component';
import { FilterTableComponent } from '@app/shared/components/filter-table/filter-table.component';

@Component({
  selector: 'app-work-day-list',
  imports: [BaseTableComponent, HeaderWorkDayComponent, FilterTableComponent],
  templateUrl: './work-day-list.component.html',
  styleUrl: './work-day-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkDayListComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(SnackBarService);
  private readonly dialog = inject(MatDialog);
  private readonly workDayService = inject(WorkDayService);
  private userService = inject(UserService);
  private hiredServiceService = inject(HiredServiceService);
  private readonly responsiveService = inject(ResponsiveService);

  dayControl = new FormControl<Date>(new Date());
  isSmallWidth = this.responsiveService.smallWidth;
  iconCreate = 'add';
  labelCreate = $localize`:@@work_day.add:Add new Work Day`;
  valueToFilter = signal<string>('');
  workDays = signal<WorkDay[]>([]);
  tableWorkDays = computed(() =>
    this.workDays().map(w => ({
      id: w.id,
      day: w.day,
      start: w.start,
      finish: w.finish,
      user: w.user?.name + ' ' + w.user?.surname,
      hiredService: w.hiredService?.name,
    }))
  );

  columns: string[] = [
    'day',
    'start',
    'finish',
    'user',
    'hiredService',
    'action',
  ];
  labels: string[] = [
    $localize`:@@word.day:Day`,
    $localize`:@@word.start:Start`,
    $localize`:@@word.finish:Finish`,
    $localize`:@@word.operator:Operator`,
    $localize`:@@word.hired_service:Service`,
    $localize`:@@word.action:Action`,
  ];
  sortables: string[] = ['day', 'start', 'finish', 'user', 'hiredService'];

  tableColumns: TableColumns = {
    columns: [...this.columns],
    labels: [...this.labels],
    sortables: [...this.sortables],
    date: ['day'],
    time: ['start', 'finish'],
    actions: {
      update: true,
      view: false,
      delete: false,
    },
  };

  private users = toSignal(
    this.userService.getAllUsersByRole(UserRole.OPERATOR),
    {
      initialValue: [] as User[],
    }
  );

  private hiredServices = toSignal(
    this.hiredServiceService.getAllHiredServicesWithSectors(),
    {
      initialValue: [] as HiredService[],
    }
  );

  ngOnInit(): void {
    this.getAllWorkDays(new Date());
  }

  getAllWorkDays(date: Date) {
    this.workDayService
      .getAllWorkDaysByDate(date)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((workDays: WorkDay[]) => this.workDays.set(workDays))
      )
      .subscribe();
  }

  setDay(date: Date) {
    this.getAllWorkDays(date);
  }

  create() {
    const wordDay = {
      day: '',
      start: '',
      finish: '',
      user: defaultUser,
      hiredService: defaultHiredService,
      sector: defaultSector,
    };
    this.getDialog(true, wordDay);
  }

  public action(data: TableAction) {
    const workDay = this.workDays().find(w => w.id === data?.id);

    switch (data.action) {
      case ActionType.VIEW: {
        this.dialog.open(WorkDayDialogViewComponent, {
          data: {
            workDay: workDay,
          },
        });
        return;
      }
      case ActionType.UPDATE: {
        if (workDay && workDay.day) {
          const now = this.formatDate(new Date());
          const date = this.formatDate(new Date(workDay.day));
          if (date > now) {
            this.getDialog(false, workDay);
          } else {
            this.snackBar.showToast(
              $localize`:@@work_day.not_allow:You cannot update a finished work day`
            );
          }
        }
        return;
      }
      case ActionType.DELETE: {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          data: {
            title: 'Do you want to remove this Sector?',
          },
        });

        dialogRef
          .afterClosed()
          .pipe(
            filter(result => result === true),
            mergeMap(() => this.workDayService.deleteWorkDay(data.id))
          )
          .subscribe({
            next: () => {
              this.snackBar.showToast(
                $localize`:@@work_day.deleted:Deleted Work Day`
              );
              this.getAllWorkDays(new Date());
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
    workDay: WorkDay | Omit<WorkDay, 'id'> | undefined
  ) {
    const dialogRef = this.dialog.open(WorkDayDialogEditComponent, {
      data: {
        isNew: isNew,
        workDay: workDay,
        users: this.users(),
        hiredServices: this.hiredServices(),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.snackBar.showToast(
          $localize`:@@work_day.created:Created Work Day`
        );
        this.getAllWorkDays(new Date());
      }
      if (result === 'updated') {
        this.snackBar.showToast(
          $localize`:@@work_day.updated:Updated Work Day`
        );
        this.getAllWorkDays(new Date());
      }
    });
  }

  formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
  }
}
