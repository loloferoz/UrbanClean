import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Location } from '@app/features/location/models';
import { IncidentService } from '../incident.service';
import { Image } from '@app/shared/models';
import { ImageInputComponent } from '@app/shared/components/image-input/image-input.component';
import { LocationFormComponent } from '@app/shared/components/location-form/location-form.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { ResponsiveService } from '@app/core/services/responsive.service';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatStepperModule,
  MatIconModule,
];

@Component({
  selector: 'app-incident-dialog-operator',
  imports: [
    ReactiveFormsModule,
    LocationFormComponent,
    ImageInputComponent,
    MATERIAL_MODULES,
  ],
  templateUrl: './incident-dialog-operator.component.html',
  styleUrl: './incident-dialog-operator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentDialogOperatorComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<IncidentDialogOperatorComponent>);
  readonly data = inject<{
    isNew: boolean;
    currentLocation: Location;
    location: Location;
  }>(MAT_DIALOG_DATA);

  private formBuilder = inject(FormBuilder);
  private incidentService = inject(IncidentService);
  readonly responsiveService = inject(ResponsiveService);
  closeDialog = 'nothing';

  image!: Image;
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      description: ['', Validators.required],
      image: ['', Validators.required],
    });

    if (!this.data.isNew && this.data.location.incident) {
      this.image = this.data.location.incident.firstImage!;
      this.form.patchValue({
        description: this.data.location.incident.description,
        image: this.data.location.incident.firstImage,
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

  emitAction() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData: FormData = new FormData();
    const start = this.formatDateToString(new Date());

    formData.append('description', this.form.get('description')?.value);
    formData.append('start', start);
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
        error: errr => {
          this.closeDialog = 'error';
          console.log('Error creating incident:', errr);
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
}
