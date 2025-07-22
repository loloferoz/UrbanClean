import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MapService } from '@app/core/services/map.service';
import { NumberValidation } from '@app/core/validations/validations';
import { defaultLocation, Location } from '@app/features/location/models';

const MATERIAL_MODULES = [MatButtonModule, MatFormFieldModule, MatInputModule];

@Component({
  selector: 'app-location-form',
  imports: [ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './location-form.component.html',
  styleUrl: './location-form.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationFormComponent implements OnInit, OnDestroy {
  controlKey = input.required<string>();
  parentContainer = inject(ControlContainer);
  data = input<Location | Omit<Location, 'id'>>(defaultLocation);
  private mapService = inject(MapService);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormGroup({
        city: new FormControl(this.data()?.city || '', Validators.required),
        street: new FormControl(this.data()?.street || '', Validators.required),
        number: new FormControl(this.data()?.number || 0, [
          ...NumberValidation,
          Validators.max(500),
        ]),
        latitude: new FormControl(
          this.data()?.latitude || '',
          Validators.required
        ),
        longitude: new FormControl(
          this.data()?.longitude || '',
          Validators.required
        ),
      })
    );

    this.mapService
      .getAddress({
        lat: +this.data().latitude,
        lng: +this.data().longitude,
      })
      .subscribe(location => {
        if (location)
          this.parentFormGroup.get(this.controlKey())?.patchValue(location);
      });
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.controlKey());
  }
}
