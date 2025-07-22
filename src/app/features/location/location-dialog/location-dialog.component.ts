import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { LocationService } from '../location.service';
import { Location } from '../models';
import { LocationFormComponent } from '@app/shared/components/location-form/location-form.component';

const MATERIAL_MODULES = [MatButtonModule, MatDialogModule, MatInputModule];

@Component({
  selector: 'app-location-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, LocationFormComponent, MATERIAL_MODULES],
  templateUrl: './location-dialog.component.html',
  styleUrl: './location-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<LocationDialogComponent>);
  readonly data = inject<{ isNew: boolean; location: Location }>(
    MAT_DIALOG_DATA
  );

  private formBuilder = inject(FormBuilder);
  private locationService = inject(LocationService);

  closeDialog = 'nothing';

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.formBuilder.group({});
  }

  getTittle() {
    return this.data.isNew
      ? $localize`:@@location.create:Create a new Location`
      : $localize`:@@location.update:Update Location`;
  }

  emitAction() {
    if (!this.form.valid) {
      return;
    }

    const locationForm = this.form.get('location')?.value;
    this.form.reset();

    if (this.data.isNew) {
      this.locationService.createLocation(locationForm).subscribe({
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
      this.locationService
        .updateLocation(this.data.location.id, locationForm)
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
