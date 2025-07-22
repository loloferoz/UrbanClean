import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private snackBar = inject(MatSnackBar);

  showToast(
    message: string,
    action = $localize`:@@word.close: Close `,
    config?: MatSnackBarConfig
  ) {
    this.snackBar.open(
      message,
      action,
      config || {
        duration: 7000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      }
    );
  }

  showToastObserver(
    message: string,
    action = 'Close',
    config?: MatSnackBarConfig
  ) {
    return this.snackBar.open(
      message,
      action,
      config || {
        duration: 7000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      }
    );
  }
}
