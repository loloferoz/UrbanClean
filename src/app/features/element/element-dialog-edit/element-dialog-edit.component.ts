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
import { Element, ElementType, labelElementType } from '../models';
import { ElementService } from '../element.service';
import { MatSelectModule } from '@angular/material/select';
import { Image } from '@app/shared/models';
import { ImageInputComponent } from '@app/shared/components/image-input/image-input.component';
import { NumberValidation } from '@app/core/validations/validations';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
];

@Component({
  selector: 'app-element-dialog-edit',
  standalone: true,
  imports: [ReactiveFormsModule, ImageInputComponent, MATERIAL_MODULES],
  templateUrl: './element-dialog-edit.component.html',
  styleUrl: './element-dialog-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementDialogEditComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ElementDialogEditComponent>);
  readonly data = inject<{ isNew: boolean; element: Element }>(MAT_DIALOG_DATA);

  private formBuilder = inject(FormBuilder);
  private elementService = inject(ElementService);
  private closeDialog = 'nothing';
  image!: Image;
  form!: FormGroup;

  elementType = Object.values(ElementType);
  labelElementType = labelElementType;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      capacity: [0, NumberValidation],
      elementType: ['', Validators.required],
      image: ['', Validators.required],
    });

    if (!this.data.isNew) {
      this.image = this.data.element.image!;
      this.form.patchValue(this.data.element);
    }
  }

  setFile(file: File): void {
    this.form.patchValue({ image: file });
  }

  getTittle() {
    return this.data.isNew
      ? $localize`:@@element.create:Create a new Element`
      : $localize`:@@element.update:Update Element`;
  }

  emitAction() {
    if (!this.form.valid) {
      this.form.get('image')?.markAsTouched();
      return;
    }

    const formData: FormData = new FormData();
    formData.append('name', this.form.get('name')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('capacity', this.form.get('capacity')?.value);
    formData.append('elementType', this.form.get('elementType')?.value);
    formData.append('image', this.form.get('image')?.value);

    this.form.reset();

    if (this.data.isNew) {
      this.elementService.createElement(formData).subscribe({
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
    } else {
      this.elementService
        .updateElement(this.data.element.id, formData)
        .subscribe({
          next: () => {
            this.closeDialog = 'updated';
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
}
