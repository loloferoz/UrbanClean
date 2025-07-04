import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
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
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AddressFormComponent } from '@app/shared/components/address-form/address-form.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { ClientType, labelClientType } from '@app/features/client/models';
import { SnackBarService } from '@app/core/services/snack-bar.service';
import { ResponsiveService } from '@app/core/services/responsive.service';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatStepperModule,
];

@Component({
  selector: 'app-complete-register',
  standalone: true,
  imports: [ReactiveFormsModule, AddressFormComponent, MATERIAL_MODULES],
  templateUrl: './complete-register.component.html',
  styleUrl: './complete-register.component.scss',
  host: { class: 'flex flex-col items-center justify-center min-h-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteRegisterComponent implements OnInit {
  form!: FormGroup;
  formError = signal('');
  token = input.required<string>();

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(SnackBarService);
  readonly responsiveService = inject(ResponsiveService);

  clientTypes = Object.values(ClientType);
  labelClientType = labelClientType;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      client: this.formBuilder.group({
        nif: ['', Validators.required],
        name: ['', Validators.required],
        description: ['', Validators.required],
        clientType: ['', Validators.required],
      }),
    });
  }

  completeRegister() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const completeRegisterForm = this.form.value;
    this.form.reset();

    this.authService
      .completeRegister(this.token(), completeRegisterForm)
      .subscribe({
        next: () => {
          this.snackBar.showToast(`¡Cuenta creada con éxito!`);
          this.router.navigate(['/auth/login']);
        },
        error: err => this.formError.set(err),
      });
  }
}
