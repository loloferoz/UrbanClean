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
import {
  NumberValidation,
  ZipCodeValidation,
} from '@app/core/validations/validations';
import { Address, defaultAddress } from '@app/shared/models';

const MATERIAL_MODULES = [MatButtonModule, MatFormFieldModule, MatInputModule];

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent implements OnInit, OnDestroy {
  controlKey = input.required<string>();
  parentContainer = inject(ControlContainer);
  data = input<Address | Omit<Address, 'id'>>(defaultAddress);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormGroup({
        country: new FormControl(
          this.data()?.country || '',
          Validators.required
        ),
        community: new FormControl(
          this.data()?.community || '',
          Validators.required
        ),
        city: new FormControl(this.data()?.city || '', Validators.required),
        street: new FormControl(this.data()?.street || '', Validators.required),
        number: new FormControl(this.data()?.number || '', [
          ...NumberValidation,
          Validators.max(500),
        ]),
        zipCode: new FormControl(this.data()?.zipCode || '', ZipCodeValidation),
      })
    );
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.controlKey());
  }
}
