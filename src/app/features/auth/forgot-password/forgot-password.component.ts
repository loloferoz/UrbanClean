import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';
import {
  EmailDomainsValidator,
  EmailValidation,
} from '@app/core/validations/validations';
import { RouterLink } from '@angular/router';
import { RedirectForgotPasswordComponent } from '../redirect-forgot-password/redirect-forgot-password.component';
import { SnackBarService } from '@app/core/services/snack-bar.service';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
];

@Component({
  selector: 'app-forgot-password',
  imports: [
    RedirectForgotPasswordComponent,
    ReactiveFormsModule,
    RouterLink,
    MATERIAL_MODULES,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  host: { class: 'flex flex-col items-center justify-center min-h-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private snackBar = inject(SnackBarService);
  private readonly allowedEmailDomains = ['gmail.com'];

  form!: FormGroup;

  isEmailSend = signal(false);
  formError = signal('');
  ngOnInit() {
    this.authService.logout();
    this.form = this.formBuilder.group({
      email: [
        '',
        [...EmailValidation, EmailDomainsValidator(this.allowedEmailDomains)],
      ],
    });
  }

  sendEmail() {
    if (!this.form.valid) {
      return;
    }

    const email = this.form.get('email')?.value;
    this.form.reset();

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.snackBar.showToast(`¡Cuenta creada con éxito!`);
        this.isEmailSend.set(true);
      },
      error: err => {
        this.formError.set(err);
      },
    });
  }
}
