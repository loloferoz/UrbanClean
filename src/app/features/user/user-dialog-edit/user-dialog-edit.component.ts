import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
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
import { AddressFormComponent } from '@app/shared/components/address-form/address-form.component';
import { UserService } from '../user.service';
import { ResponsiveService } from '@app/core/services/responsive.service';
import {
  ContractCategory,
  ContractTurn,
  labelContractCategory,
  labelContractTurn,
  User,
} from '../models';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  EmailDomainsValidator,
  EmailValidation,
  MatchValidator,
  MinimumAgeValidator,
  NumberValidation,
  PasswordValidation,
} from '@app/core/validations/validations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgClass } from '@angular/common';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatStepperModule,
  MatDatepickerModule,
  MatSelectModule,
];

@Component({
  selector: 'app-user-dialog-edit',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    AddressFormComponent,
    NgClass,
    MATERIAL_MODULES,
  ],
  templateUrl: './user-dialog-edit.component.html',
  styleUrl: './user-dialog-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialogEditComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<UserDialogEditComponent>);
  readonly data = inject<{ isNew: boolean; user: User }>(MAT_DIALOG_DATA);

  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  readonly responsiveService = inject(ResponsiveService);
  closeDialog = 'nothing';
  hide = signal(true);
  allowedEmailDomains = ['gmail.com', 'urbanclean.io'];

  form!: FormGroup;

  contractCategory = Object.values(ContractCategory);
  labelContractCategory = labelContractCategory;

  contractTurn = Object.values(ContractTurn);
  labelContractTurn = labelContractTurn;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: [
        '',
        [...EmailValidation, EmailDomainsValidator(this.allowedEmailDomains)],
      ],
      password: ['', PasswordValidation],
      confirmPassword: ['', [MatchValidator()]],
      dateOfBirth: ['', [Validators.required, MinimumAgeValidator(18)]],
      contract: this.formBuilder.group({
        start: ['', Validators.required],
        finish: [''],
        workingDay: ['', [...NumberValidation, Validators.max(40)]],
        contractCategory: ['', Validators.required],
        contractTurn: ['', Validators.required],
      }),
    });

    if (!this.data.isNew) {
      this.form.patchValue(this.data.user);
    }
  }

  getTittle() {
    return this.data.isNew
      ? $localize`:@@user.create:Create a new Employee`
      : $localize`:@@user.update:Update Employee`;
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  emitAction() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const userForm = this.form.value;
    delete userForm.confirmPassword;
    if (!this.data.isNew && userForm.password === '') {
      delete userForm.password;
    }
    if (userForm.contract.finish === '') {
      delete userForm.contract.finish;
    }

    this.form.reset();

    if (this.data.isNew) {
      this.userService.createUser(userForm).subscribe({
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
      this.userService.updateUser(this.data.user.id, userForm).subscribe({
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
