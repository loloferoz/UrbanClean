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
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Center, CenterType, labelCenterType } from '../models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CenterService } from '../center.service';
import { MatStepperModule } from '@angular/material/stepper';
import { AddressFormComponent } from '@app/shared/components/address-form/address-form.component';
import { ResponsiveService } from '@app/core/services/responsive.service';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatStepperModule,
];

@Component({
  selector: 'app-center-dialog-edit',
  standalone: true,
  imports: [ReactiveFormsModule, AddressFormComponent, MATERIAL_MODULES],
  templateUrl: './center-dialog-edit.component.html',
  styleUrl: './center-dialog-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterDialogEditComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CenterDialogEditComponent>);
  readonly data = inject<{ isNew: boolean; center: Center }>(MAT_DIALOG_DATA);

  private formBuilder = inject(FormBuilder);
  private centerService = inject(CenterService);
  readonly responsiveService = inject(ResponsiveService);
  closeDialog = 'nothing';

  form!: FormGroup;

  centerTypes = Object.values(CenterType);
  labelCenterType = labelCenterType;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      centerType: ['', Validators.required],
    });

    if (!this.data.isNew) {
      this.form.patchValue(this.data.center);
    }
  }

  getTittle() {
    return this.data.isNew
      ? $localize`:@@center.create:Create a new Center`
      : $localize`:@@center.update:Update Center`;
  }

  emitAction() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const centreForm = this.form.value;
    this.form.reset();

    if (this.data.isNew) {
      this.centerService.createCenter(centreForm).subscribe({
        next: () => {
          this.closeDialog = 'created';
          this.dialogRef.close(this.closeDialog);
        },
        error: errr => {
          console.log(errr);

          this.closeDialog = 'error';
          this.dialogRef.close(this.closeDialog);
        },
      });
    } else {
      this.centerService
        .updateCenter(this.data.center.id, centreForm)
        .subscribe({
          next: () => {
            this.closeDialog = 'updated';
            this.dialogRef.close(this.closeDialog);
          },
          error: () => {
            this.closeDialog = 'error';
            this.dialogRef.close(this.closeDialog);
          },
        });
    }
  }
}
