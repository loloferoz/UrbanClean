import { inject, Injectable, signal } from '@angular/core';
import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map, mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from './snack-bar.service';
import { AuthService } from '@app/features/auth/auth.service';
import { IncidentService } from '@app/features/incident/incident.service';
import { PushNotification } from '@app/shared/models';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly snackBarService = inject(SnackBarService);
  private readonly swPush = inject(SwPush);
  private readonly httpClient = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly incidentService = inject(IncidentService);
  readonly isEnabled = signal(this.swUpdate.isEnabled);

  private readonly baseUrl = `${environment.baseUrl}/api/push-notifications`;
  // private readonly baseUrl = 'http://localhost:3000/api/push-notifications';

  updateVersion() {
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        mergeMap(() =>
          this.snackBarService
            .showToastObserver(
              $localize`:@@push.reload:New version available`,
              $localize`:@@word.reload:Reload`
            )
            .onAction()
            .pipe(map(() => window.location.reload()))
        )
      )
      .subscribe();
  }

  subscribeSuscription() {
    this.swPush
      .requestSubscription({ serverPublicKey: environment.pushPublicKey })
      .then(sub => {
        this.httpClient.post(this.baseUrl, sub).subscribe();
      })
      .catch(err => console.error('Could not subscribe to notifications', err));

    this.swPush.messages.subscribe(message => {
      const pushNotification = message as PushNotification;
      console.log('pushNotification', message);
      if (
        this.authService.user()?.id ===
        pushNotification.notification?.data?.user?.id
      ) {
        console.log('pushNotification', message);
        this.incidentService.getAllIncidentForCounter().subscribe();
        this.snackBarService.showToast($localize`:@@push.new:New Incident`);
      }
    });
  }
}
