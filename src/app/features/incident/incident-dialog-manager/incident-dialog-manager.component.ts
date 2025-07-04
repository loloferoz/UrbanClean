import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { IncidentService } from '../incident.service';
import { Image } from '@app/shared/models';
import { Location } from '@app/features/location/models';
import { ImageInputComponent } from '@app/shared/components/image-input/image-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  IncidentPriority,
  IncidentStatus,
  labelIncidentPriority,
  labelIncidentStatus,
} from '../models';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '@app/features/user/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '@app/features/user/models';
import { LocationFormComponent } from '@app/shared/components/location-form/location-form.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { ResponsiveService } from '@app/core/services/responsive.service';
import { map, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatSelectModule,
  MatFormFieldModule,
  MatStepperModule,
  MatIconModule,
  MatAutocompleteModule,
];

@Component({
  selector: 'app-incident-dialog-manager',
  imports: [
    ReactiveFormsModule,
    LocationFormComponent,
    ImageInputComponent,
    MATERIAL_MODULES,
  ],
  templateUrl: './incident-dialog-manager.component.html',
  styleUrl: './incident-dialog-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentDialogManagerComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<IncidentDialogManagerComponent>);
  readonly data = inject<{
    isNew: boolean;
    currentLocation: Location;
    location: Location;
    users: User[];
  }>(MAT_DIALOG_DATA);

  private formBuilder = inject(FormBuilder);
  private incidentService = inject(IncidentService);
  private userService = inject(UserService);
  readonly responsiveService = inject(ResponsiveService);
  closeDialog = 'nothing';

  image!: Image;
  form!: FormGroup;
  incidentPriorities = Object.values(IncidentPriority);
  labelIncidentPriorities = labelIncidentPriority;

  incidentStatus = Object.values(IncidentStatus);
  labelIncidentStatus = labelIncidentStatus;
  userControl = new FormControl('', Validators.required);
  users = signal<User[]>(this.data.users);

  filteredUsers = toSignal(
    this.userControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterUsers(value))
    ),
    { initialValue: [] as User[] }
  );

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      description: ['', Validators.required],
      instruction: ['', Validators.required],
      incidentPriority: ['', Validators.required],
      whoIsResponsibleId: ['', Validators.required],
      image: ['', Validators.required],
    });

    if (!this.data.isNew && this.data.location.incident) {
      this.image = this.data.location.incident.firstImage!;
      if (this.data.location.incident.whoIsResponsible) {
        this.userControl.setValue(
          this.data.location.incident.whoIsResponsible.name +
            ' ' +
            this.data.location.incident.whoIsResponsible.surname
        );
      }
      this.form.patchValue({
        description: this.data.location.incident.description,
        instruction: this.data.location.incident.instruction,
        incidentPriority: this.data.location.incident.incidentPriority,
        image: this.data.location.incident.firstImage,
        whoIsResponsibleId: this.data.location.incident.whoIsResponsible
          ? this.data.location.incident.whoIsResponsible.id
          : '',
      });
    }
  }

  setFile(file: File): void {
    this.form.patchValue({ image: file });
  }

  getTittle() {
    return this.data.isNew
      ? $localize`:@@incident.create:Create a new Incident`
      : $localize`:@@incident.update:Update Incident`;
  }

  setUser(user: User | null): void {
    this.form.get('whoIsResponsibleId')?.setValue(user?.id);
  }

  emitAction() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.userControl.setValue('');
      return;
    }

    const formData: FormData = new FormData();

    formData.append('description', this.form.get('description')?.value);
    formData.append('instruction', this.form.get('instruction')?.value);
    formData.append(
      'incidentPriority',
      this.form.get('incidentPriority')?.value
    );
    formData.append('incidentStatus', IncidentStatus.DELEGATED);
    if (this.data.isNew) {
      const start = this.formatDateToString(new Date());
      formData.append('start', start);
    }
    formData.append(
      'whoIsResponsibleId',
      this.form.get('whoIsResponsibleId')?.value
    );
    formData.append('image', this.form.get('image')?.value);
    formData.append('city', this.form.get('location')?.get('city')?.value);
    formData.append('street', this.form.get('location')?.get('street')?.value);
    formData.append('number', this.form.get('location')?.get('number')?.value);
    formData.append(
      'latitude',
      this.form.get('location')?.get('latitude')?.value
    );
    formData.append(
      'longitude',
      this.form.get('location')?.get('longitude')?.value
    );

    this.form.reset();

    if (this.data.isNew) {
      this.incidentService.createIncident(formData).subscribe({
        next: () => {
          this.closeDialog = 'created';
          this.dialogRef.close(this.closeDialog);
        },
        error: () => {
          this.closeDialog = 'error';
          this.dialogRef.close(this.closeDialog);
        },
      });
    } else {
      this.incidentService
        .updateIncident(this.data.location.incident?.id, formData)
        .subscribe({
          next: () => {
            this.closeDialog = 'created';
            this.dialogRef.close(this.closeDialog);
          },
          error: () => {
            this.closeDialog = 'error';
            this.dialogRef.close(this.closeDialog);
          },
        });
    }
  }

  formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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
