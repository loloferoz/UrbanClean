import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  HiredService,
  HiredServiceType,
  labelHiredServiceType,
} from '../models';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HiredServiceService } from '../hired-service.service';
import { MatSelectModule } from '@angular/material/select';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
];

@Component({
  selector: 'app-hired-service-dialog-edit',
  standalone: true,
  imports: [ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './hired-service-dialog-edit.component.html',
  styleUrl: './hired-service-dialog-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HiredServiceDialogEditComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<HiredServiceDialogEditComponent>);
  readonly data = inject<{ isNew: boolean; hiredService: HiredService }>(
    MAT_DIALOG_DATA
  );

  private formBuilder = inject(FormBuilder);
  private hiredServiceService = inject(HiredServiceService);

  closeDialog = signal('nothing');

  form!: FormGroup;

  labelHiredServiceType = labelHiredServiceType;
  hiredServiceTypes = Object.values(HiredServiceType);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      hiredServiceType: ['', Validators.required],
    });

    if (!this.data.isNew) {
      this.form.patchValue(this.data.hiredService);
    }
  }

  getTittle() {
    return this.data.isNew
      ? $localize`:@@hired_service.create:Create a new Service`
      : $localize`:@@hired_service.update:Update Service`;
  }

  emitAction() {
    if (!this.form.valid) {
      return;
    }

    const hiredServiceForm = this.form.value;
    this.form.reset();

    if (this.data.isNew) {
      this.hiredServiceService.createHiredService(hiredServiceForm).subscribe({
        next: () => {
          this.closeDialog.set('created');
          this.dialogRef.close(this.closeDialog());
        },
        error: err => {
          console.log('error', err);
          this.closeDialog.set('error');
        },
      });
    } else {
      this.hiredServiceService
        .updateHiredService(this.data.hiredService.id, hiredServiceForm)
        .subscribe({
          next: () => {
            this.closeDialog.set('updated');
            this.dialogRef.close(this.closeDialog());
          },
          error: err => {
            console.log('error', err);
            this.closeDialog.set('error');
          },
        });
    }
  }
}
