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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { IncidentService } from '../incident.service';
import { ResponsiveService } from '@app/core/services/responsive.service';
import { Image } from '@app/shared/models';
import { Location } from '@app/features/location/models';
import { DatePipe } from '@angular/common';
import { ImagePathPipe } from '@app/shared/pipes/image-path.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { ImageInputComponent } from '@app/shared/components/image-input/image-input.component';
import { IncidentStatus } from '../models';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatStepperModule,
  MatChipsModule,
];

@Component({
  selector: 'app-incident-dialog-complete',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    ImagePathPipe,
    ImageInputComponent,
    MATERIAL_MODULES,
  ],
  templateUrl: './incident-dialog-complete.component.html',
  styleUrl: './incident-dialog-complete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentDialogCompleteComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<IncidentDialogCompleteComponent>);
  readonly data = inject<{ location: Location }>(MAT_DIALOG_DATA);

  private formBuilder = inject(FormBuilder);
  private incidentService = inject(IncidentService);
  readonly responsiveService = inject(ResponsiveService);
  closeDialog = 'nothing';

  image!: Image;
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      observation: [''],
      image: ['', Validators.required],
    });
  }

  setFile(file: File): void {
    this.form.patchValue({ image: file });
  }

  emitAction() {
    if (!this.form.valid) {
      this.form.get('image')?.markAsTouched();
      return;
    }

    const formData: FormData = new FormData();
    const finish = this.formatDateToString(new Date());

    if (this.form.get('observation')?.value !== '') {
      formData.append('observation', this.form.get('observation')?.value);
    }
    formData.append('image', this.form.get('image')?.value);
    formData.append('incidentStatus', IncidentStatus.FINISHED);
    formData.append('finish', finish);
    this.form.reset();

    this.incidentService
      .completeIncident(this.data.location.incident?.id, formData)
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

  formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
