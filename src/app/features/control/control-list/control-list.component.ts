import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { ControlService } from '../control.service';
import { Control, ControlQuery, labelControlStatus } from '../models';
import { TableAction, TableColumns } from '@app/shared/models';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map, startWith, tap } from 'rxjs';
import { BaseTableComponent } from '@app/shared/components/base-table/base-table.component';
import { FilterTableComponent } from '@app/shared/components/filter-table/filter-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UserService } from '@app/features/user/user.service';
import { User, UserRole } from '@app/features/user/models';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ControlDialogViewComponent } from '../control-dialog-view/control-dialog-view.component';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatAutocompleteModule,
];

@Component({
  selector: 'app-control-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BaseTableComponent,
    FilterTableComponent,
    DatePipe,
    MATERIAL_MODULES,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './control-list.component.html',
  styleUrl: './control-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlListComponent implements OnInit {
  private readonly controlService = inject(ControlService);
  private userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private formBuilder = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  accordion = viewChild.required(MatAccordion);
  valueToFilter = signal<string>('');
  private labelControlStatus = labelControlStatus;
  _controls = signal<Control[]>([]);
  controls = computed(() =>
    this._controls().map(c => ({
      ...c,
      controlStatus: this.labelControlStatus.get(c.controlStatus),
      service: c.workDay.hiredService.name,
      location:
        c.elementPerLocation.location.street +
        ' ' +
        c.elementPerLocation.location.number,
      image: c.image?.path,
    }))
  );

  userControl = new FormControl('', Validators.required);
  users = toSignal(this.userService.getAllUsersByRole(UserRole.OPERATOR), {
    initialValue: [] as User[],
  });

  notOperator = $localize`:@@word.not_worker:No worker`;

  filteredUsers = toSignal(
    this.userControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterUsers(value))
    ),
    { initialValue: [] as User[] }
  );

  private readonly now = new Date();
  readonly maxDate = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate()
  );

  form!: FormGroup;

  private readonly columns: string[] = [
    'service',
    'location',
    'observation',
    'controlStatus',
    'image',
    'action',
  ];
  private readonly labels: string[] = [
    $localize`:@@word.service:Service`,
    $localize`:@@word.location:Location`,
    $localize`:@@word.observation:Observation`,
    $localize`:@@word.control_status:Control Status`,
    $localize`:@@word.image:Image`,
    $localize`:@@word.action:Action`,
  ];
  private readonly sortables: string[] = [
    'service',
    'location',
    'observation',
    'controlStatus',
    'image',
    'action',
  ];

  tableColumns: TableColumns = {
    columns: [...this.columns],
    labels: [...this.labels],
    sortables: [...this.sortables],
    chips: ['controlStatus'],
    actions: {
      update: false,
      view: true,
      delete: false,
    },
  };

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      date: [new Date(), Validators.required],
      userId: ['', Validators.required],
    });
  }

  getAllCotrols(controlQuery: ControlQuery) {
    this.controlService
      .getAllControlsByDateAndOperator(controlQuery)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((controls: Control[]) => this._controls.set(controls))
      )
      .subscribe();
  }

  setUser(user: User) {
    this.form.get('userId')?.setValue(user.id);
  }

  emitAction() {

    if (!this.form.valid) {
      this.userControl.setValue('');
      return;
    }
    this.accordion().closeAll();
    this.getAllCotrols(this.form.value);
  }

  private filterUsers(value: string | null): User[] {
    const filterValue = (value ?? '').toLowerCase();
    return this.users().filter(
      user =>
        user.name.toLowerCase().includes(filterValue) ||
        user.surname.toLowerCase().includes(filterValue)
    );
  }

  public action(data: TableAction) {
    const control = this._controls().find(c => c.id === data?.id);
    
    if(data.action === 'view' && control) {
      this.dialog.open(ControlDialogViewComponent, {
          data: {
            control: control,
          },
          width: '420px',
        });
    }
  }
}
