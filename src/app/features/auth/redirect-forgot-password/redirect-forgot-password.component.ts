import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterLink } from '@angular/router';
import { Subscription, take, timer } from 'rxjs';

const MATERIAL_MODULES = [MatButtonModule, MatIconModule, MatProgressBarModule];

@Component({
  selector: 'app-redirect-forgot-password',
  imports: [RouterLink, MATERIAL_MODULES],
  templateUrl: './redirect-forgot-password.component.html',
  styleUrl: './redirect-forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedirectForgotPasswordComponent implements OnInit {
  private router = inject(Router);
  timeLeft = signal(5);
  countDown$: Subscription | undefined;
  ngOnInit() {
    this.startCountDown(5);
  }

  startCountDown(seconds: number) {
    this.countDown$ = timer(0, 1000)
      .pipe(take(seconds + 1))
      .subscribe({
        next: value => this.timeLeft.set(seconds - value),
        complete: () => this.router.navigate(['/auth/login']),
        error: err => console.error('countdownt error: ', err),
      });
  }
}
