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
import { Sector } from '../models';
import { SectorService } from '../sector.service';
import { HiredServiceService } from '@app/features/hired-service/hired-service.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { HiredService } from '@app/features/hired-service/models';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
];

@Component({
  selector: 'app-sector-dialog-edit',
  standalone: true,
  imports: [ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './sector-dialog-edit.component.html',
  styleUrl: './sector-dialog-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectorDialogEditComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SectorDialogEditComponent>);
  readonly data = inject<{ isNew: boolean; sector: Sector }>(MAT_DIALOG_DATA);

  private formBuilder = inject(FormBuilder);
  private sectorService = inject(SectorService);
  private hiredServiceService = inject(HiredServiceService);

  private hiredServices$ = this.hiredServiceService.getAllHiredServices();
  hiredServices = toSignal(this.hiredServices$, {
    initialValue: [] as HiredService[],
  });

  closeDialog = 'nothing';
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      hiredService: ['', Validators.required],
    });

    if (!this.data.isNew) {
      this.form.patchValue(this.data.sector);
      this.form
        .get('hiredService')
        ?.setValue(this.data.sector.hiredService?.id);
    }
  }

  getTittle() {
    return this.data.isNew
      ? $localize`:@@sector.create:Create a new Sector`
      : $localize`:@@sector.update:Update Sector`;
  }

  emitAction() {
    if (!this.form.valid) {
      return;
    }

    const service = this.hiredServices().find(
      s => s.id === this.form.get('hiredService')?.value
    );
    const sectorForm = { ...this.form.value, hiredService: service };
    this.form.reset();

    if (this.data.isNew) {
      this.sectorService.createSector(sectorForm).subscribe({
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
      this.sectorService
        .updateSector(this.data.sector.id, sectorForm)
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
