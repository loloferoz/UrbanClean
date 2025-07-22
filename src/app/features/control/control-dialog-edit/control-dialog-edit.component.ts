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
import { ElementDialogEditComponent } from '@app/features/element/element-dialog-edit/element-dialog-edit.component';
import { ControlService } from '../control.service';
import { Image } from '@app/shared/models';
import { Control, ControlStatus, labelControlStatus } from '../models';
import { MatSelectModule } from '@angular/material/select';
import { ImageInputComponent } from '@app/shared/components/image-input/image-input.component';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
];

@Component({
  selector: 'app-control-dialog-edit',
  standalone: true,
  imports: [ReactiveFormsModule, ImageInputComponent, MATERIAL_MODULES],
  templateUrl: './control-dialog-edit.component.html',
  styleUrl: './control-dialog-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlDialogEditComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ElementDialogEditComponent>);
  readonly data = inject<{ isNew: boolean; control: Control }>(MAT_DIALOG_DATA);

  private formBuilder = inject(FormBuilder);
  private controlService = inject(ControlService);
  private closeDialog = 'nothing';

  image!: Image;
  form!: FormGroup;

  controlStatus = Object.values(ControlStatus);
  labelControlStatus = labelControlStatus;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      observation: [''],
      controlStatus: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  setFile(file: File): void {
    this.form.patchValue({ image: file });
  }

  emitAction() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData: FormData = new FormData();

    if (this.form.get('observation')?.value !== '') {
      formData.append('observation', this.form.get('observation')?.value);
    }
    formData.append('controlStatus', this.form.get('controlStatus')?.value);
    formData.append(
      'elementPerLocationId',
      this.data.control.elementPerLocation.id
    );
    formData.append('workDayId', this.data.control.workDay.id);
    formData.append(
      'elementPerLocationId',
      this.data.control.elementPerLocation.id
    );
    formData.append('image', this.form.get('image')?.value);

    this.form.reset();

    this.controlService.createControl(formData).subscribe({
      next: () => {
        this.closeDialog = 'created';
        this.dialogRef.close(this.closeDialog);
      },
      error: err => {
        console.log('err', err);
        this.closeDialog = 'error';
        this.dialogRef.close(this.closeDialog);
      },
    });
  }
}
