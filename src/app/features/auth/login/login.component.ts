import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  EmailValidation,
  PasswordValidation,
} from '@app/core/validations/validations';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ContractCategory, User, UserRole } from '@app/features/user/models';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoginBottomSheetComponent } from '../login-bottom-sheet/login-bottom-sheet.component';
import { SnackBarService } from '@app/core/services/snack-bar.service';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatButtonToggleModule,
  MatTooltipModule,
];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MATERIAL_MODULES],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  host: { class: 'flex flex-col items-center justify-center min-h-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(SnackBarService);
  private readonly bottomSheet = inject(MatBottomSheet);

  hide = signal(true);
  loginError = signal('');
  loginForm!: FormGroup;
  userRole = UserRole;
  contractCategory = ContractCategory;

  ngOnInit() {
    this.authService.logout();
    this.loginForm = this.formBuilder.group({
      email: ['', EmailValidation],
      password: ['', PasswordValidation],
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  openBottomSheet() {
    const bottomSheetRef = this.bottomSheet.open(LoginBottomSheetComponent);
    bottomSheetRef.afterDismissed().subscribe(data => {
      if (!data) {
        return;
      }
      this.changeRole(data.userSelected);
    });
  }

  login() {
    if (!this.loginForm.valid) {
      return;
    }
    this.authService
      .login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      })
      .subscribe({
        next: (user: User) => {
          this.snackBar.showToast(
            $localize`:@@login.snackBar:Welcome ${user.name}!`
          );
          this.router.navigate([
            this.homeRoutePerRole(user.userRole as UserRole),
          ]);
        },
        error: err => this.loginError.set(err),
      });
  }

  changeRole(role: UserRole | ContractCategory) {
    switch (role) {
      case UserRole.ADMIN:
        this.loginForm.patchValue({
          email: 'crisalca@urbanclean.io',
          password: 'pass1234',
        });
        return;
      case ContractCategory.FOREMAN:
        this.loginForm.patchValue({
          email: 'mabladu@urbanclean.io',
          password: 'pass1234',
        });
        return;

      case ContractCategory.DRIVER:
        this.loginForm.patchValue({
          email: 'jabelas@urbanclean.io',
          password: 'pass1234',
        });
        return;
      case ContractCategory.PAWN:
        this.loginForm.patchValue({
          email: 'romavaprat@urbanclean.io',
          password: 'pass1234',
        });
        return;
      case UserRole.CLIENT:
        this.loginForm.patchValue({
          email: '',
          password: '',
        });
        return;
      default:
        return;
    }
  }

  protected homeRoutePerRole(role: UserRole) {
    switch (role) {
      case UserRole.ADMIN:
        return 'manager';
      case UserRole.MANAGER:
        return 'manager';
      case UserRole.OPERATOR:
        return 'operator';
      default:
        return 'home';
    }
  }
}
