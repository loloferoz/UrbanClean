import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { WorkDay } from '../models';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { WorkDayService } from '../work-day.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '@app/features/user/models';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { HiredService } from '@app/features/hired-service/models';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatTimepickerModule,
  MatAutocompleteModule,
  MatSelectModule,
];

@Component({
  selector: 'app-work-day-dialog-edit',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './work-day-dialog-edit.component.html',
  styleUrl: './work-day-dialog-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkDayDialogEditComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<WorkDayDialogEditComponent>);
  readonly data = inject<{
    isNew: boolean;
    workDay: WorkDay;
    users: User[];
    hiredServices: HiredService[];
  }>(MAT_DIALOG_DATA);

  private formBuilder = inject(FormBuilder);
  private workDayService = inject(WorkDayService);
  closeDialog = 'nothing';
  form!: FormGroup;

  userControl = new FormControl('', Validators.required);
  users = signal<User[]>(this.data.users);
  hiredServices = signal<HiredService[]>(this.data.hiredServices);
  service = signal<HiredService | null>(null);
  private readonly now = new Date();
  readonly minDate = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate() + 1
  );

  filteredUsers = toSignal(
    this.userControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterUsers(value))
    ),
    { initialValue: [] as User[] }
  );

  sectors = computed(() => {
    if (this.service()) {
      this.form.get('sector')?.enable();
      return this.service()?.sectors;
    } else {
      this.form.get('sector')?.disable();
      return [];
    }
  });

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      day: ['', Validators.required],
      start: ['', Validators.required],
      finish: ['', Validators.required],
      user: ['', Validators.required],
      hiredService: ['', Validators.required],
      sector: [''],
    });

    if (!this.data.isNew) {
      this.userControl.setValue(
        this.data.workDay.user.name + ' ' + this.data.workDay.user.surname
      );
      this.setService(this.data.workDay.hiredService.id);
      this.form.get('day')?.setValue(this.data.workDay.day);
      this.form.get('start')?.setValue(this.data.workDay.start);
      this.form.get('finish')?.setValue(this.data.workDay.finish);
      this.form.get('user')?.setValue(this.data.workDay.user);
      this.form
        .get('hiredService')
        ?.setValue(this.data.workDay.hiredService.id);
      this.form.get('sector')?.setValue(this.data.workDay.sector.id);
      this.form.get('day')?.disable();
    }
  }

  getTittle() {
    return this.data.isNew
      ? $localize`:@@work_day.create:Create a new Work Day`
      : $localize`:@@work_day.update:Update Work Day`;
  }

  setUser(user: User) {
    this.form.get('user')?.setValue(user);
  }

  setService(serviceId: string): void {
    const service = this.hiredServices().find(s => s.id === serviceId);
    this.service.set(service ?? null);
  }

  emitAction() {
    if (!this.form.valid) {
      return;
    }

    const service = this.hiredServices().find(
      s => s.id === this.form.get('hiredService')?.value
    );

    const workDayForm = {
      ...this.form.value,
      hiredService: service,
      sector: service?.sectors?.find(
        s => s.id === this.form.get('sector')?.value
      ),
    };

    this.form.reset();

    if (this.data.isNew) {
      this.workDayService.createWorkDay(workDayForm).subscribe({
        next: () => {
          this.closeDialog = 'created';
          this.dialogRef.close(this.closeDialog);
        },
        error: err => {
          console.log('error', err);
          this.closeDialog = 'error';
          this.dialogRef.close(this.closeDialog);
        },
      });
    } else {
      this.workDayService
        .updateWorkDay(this.data.workDay.id, workDayForm)
        .subscribe({
          next: () => {
            this.closeDialog = 'updated';
            this.dialogRef.close(this.closeDialog);
          },
          error: err => {
            console.log('error', err);
            this.closeDialog = 'error';
            this.dialogRef.close(this.closeDialog);
          },
        });
    }
  }

  private filterUsers(value: string | null): User[] {
    const filterValue = (value ?? '').toLowerCase();
    return this.users().filter(
      user =>
        user.name.toLowerCase().includes(filterValue) ||
        user.surname.toLowerCase().includes(filterValue)
    );
  }
}
