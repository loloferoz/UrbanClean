import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { UserService } from '../user.service';
import {
  defaultUser,
  labelContractCategory,
  labelUserRole,
  User,
  UserRole,
} from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, mergeMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActionType, TableAction, TableColumns } from '@app/shared/models';
import { UserDialogEditComponent } from '../user-dialog-edit/user-dialog-edit.component';
import { FilterTableComponent } from '@app/shared/components/filter-table/filter-table.component';
import { HeaderTableComponent } from '@app/shared/components/header-table/header-table.component';
import { BaseTableComponent } from '@app/shared/components/base-table/base-table.component';
import { UserDialogWiewComponent } from '../user-dialog-wiew/user-dialog-wiew.component';
import { SnackBarService } from '@app/core/services/snack-bar.service';
import { DeleteDialogComponent } from '@app/shared/components/delete-dialog/delete-dialog.component';
import { AuthService } from '@app/features/auth/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [BaseTableComponent, HeaderTableComponent, FilterTableComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(SnackBarService);
  private readonly dialog = inject(MatDialog);

  readonly isAdmin =
    inject(AuthService).authStatus().userRole === UserRole.ADMIN;

  iconCreate = 'add';
  labelCreate = $localize`:@@user.add:Add new Employee`;

  private labelUserRole = labelUserRole;
  private labelContractCategory = labelContractCategory;
  private users = signal<User[]>([]);
  tableUsers = computed(() =>
    this.users().map(u => ({
      id: u.id,
      name: u.name,
      surname: u.surname,
      email: u.email,
      userRole: this.labelUserRole.get(u.userRole),
      contractCategory: this.labelContractCategory.get(
        u.contract.contractCategory
      ),
    }))
  );

  valueToFilter = signal<string>('');

  private readonly columns: string[] = [
    'name',
    'surname',
    'email',
    'contractCategory',
    'action',
  ];

  private readonly labels: string[] = [
    $localize`:@@word.name:Name`,
    $localize`:@@word.surname:Surname`,
    $localize`:@@word.email:E-Mail`,
    $localize`:@@word.user_type:Type of Employee`,
    $localize`:@@word.action:Action`,
  ];

  private readonly sortables: string[] = [
    'name',
    'surname',
    'email',
    'contractCategory',
  ];

  tableColumns: TableColumns = {
    columns: [...this.columns],
    labels: [...this.labels],
    sortables: [...this.sortables],
    chips: ['contractCategory'],
    actions: {
      view: true,
      update: this.isAdmin,
      delete: this.isAdmin,
    },
  };

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService
      .getAllUsers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((users: User[]) => this.users.set(users))
      )
      .subscribe();
  }

  create() {
    this.getDialog(true, defaultUser);
  }

  public action(data: TableAction) {
    const user = this.users().find(u => u.id === data?.id);

    switch (data.action) {
      case ActionType.VIEW: {
        this.dialog.open(UserDialogWiewComponent, {
          data: {
            user: user,
          },
          width: '480px',
        });
        return;
      }
      case ActionType.UPDATE: {
        this.getDialog(false, user);
        return;
      }
      case ActionType.DELETE: {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          data: {
            content: $localize`:@@user.delete:Are you sure you want to delete this Employee?`,
          },
        });

        dialogRef
          .afterClosed()
          .pipe(
            filter(result => result === true),
            mergeMap(() => this.userService.deleteUser(data?.id))
          )
          .subscribe({
            next: () => {
              this.snackBar.showToast(
                $localize`:@@user.deleted:Deleted Employee`
              );
              this.getAllUsers();
            },
            error: err => console.log('error', err),
          });
        return;
      }
      default:
        return;
    }
  }

  getDialog(isNew: boolean, user: User | Omit<User, 'id'> | undefined) {
    const dialogRef = this.dialog.open(UserDialogEditComponent, {
      data: {
        isNew: isNew,
        user: user,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.snackBar.showToast($localize`:@@user.created:Created Employee`);
        this.getAllUsers();
      }
      if (result === 'updated') {
        this.snackBar.showToast($localize`:@@user.updated:Updated Employee`);
        this.getAllUsers();
      }
    });
  }
}
