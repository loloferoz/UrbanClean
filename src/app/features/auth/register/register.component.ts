import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { AddressFormComponent } from '@app/shared/components/address-form/address-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  EmailDomainsValidator,
  EmailValidation,
  MatchValidator,
  MinimumAgeValidator,
  PasswordValidation,
} from '@app/core/validations/validations';
import { RedirectRegisterComponent } from '../redirect-register/redirect-register.component';
import { SnackBarService } from '@app/core/services/snack-bar.service';
import { ResponsiveService } from '@app/core/services/responsive.service';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatCheckboxModule,
  MatStepperModule,
];

@Component({
  selector: 'app-register',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    RedirectRegisterComponent,
    ReactiveFormsModule,
    AddressFormComponent,
    MATERIAL_MODULES,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  requiredControl = new FormControl(false, Validators.requiredTrue);
  formError = signal('');
  hide = signal(true);
  registered = signal(false);
  timeLeft = signal(5);
  allowedEmailDomains = ['gmail.com', 'urbanclean.io'];

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  readonly responsiveService = inject(ResponsiveService);
  private snackBar = inject(SnackBarService);

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: [
        '',
        [...EmailValidation, EmailDomainsValidator(this.allowedEmailDomains)],
      ],
      password: ['', PasswordValidation],
      confirmPassword: ['', [Validators.required, MatchValidator()]],
      dateOfBirth: ['', [Validators.required, MinimumAgeValidator(18)]],
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  register() {
    if (!this.requiredControl.valid) {
      return;
    }

    if (!this.registerForm.valid) {
      return;
    }

    const data = { ...this.registerForm.value };
    delete data.confirmPassword;
    this.authService.register(data).subscribe({
      next: () => {
        this.snackBar.showToast(
          $localize`:@@register.snackBar:Account created successfully!`
        );
        this.registered.set(true);
      },
      error: err => this.formError.set(err),
    });
  }
}
