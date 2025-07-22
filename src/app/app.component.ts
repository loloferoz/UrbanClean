import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResponsiveService } from './core/services/responsive.service';
import { AuthService } from './features/auth/auth.service';
import { PushNotificationService } from './core/services/push-notification.service';
import { IconService } from './core/services/icon.service';
import { SideNavComponent } from './shared/components/side-nav/side-nav.component';
import { TopNavComponent } from './shared/components/top-nav/top-nav.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { MatSidenavModule } from '@angular/material/sidenav';

const MATERIAL_MODULES = [MatSidenavModule];

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SideNavComponent,
    TopNavComponent,
    SpinnerComponent,
    MATERIAL_MODULES,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly responsiveService = inject(ResponsiveService);
  private readonly authService = inject(AuthService);
  private readonly pushService = inject(PushNotificationService);
  private readonly authStatus = this.authService.authStatus;

  constructor(private iconService: IconService) {
    effect(() => {
      if (this.pushService.isEnabled() && this.authStatus().isAuthenticated) {
        this.pushService.subscribeSuscription();
      }
    });
  }

  ngOnInit(): void {
    if (this.pushService.isEnabled()) {
      this.pushService.updateVersion();
    }
  }

  toolBarHeight = computed(() => {
    if (this.responsiveService.smallWidth()) {
      return 56;
    }
    return 64;
  });

  sideNavMode = computed(() => {
    if (this.responsiveService.largeWidth()) {
      return 'side';
    }
    return 'over';
  });

  sideNavOpened = computed(() => {
    if (
      this.responsiveService.largeWidth() &&
      this.authStatus().isAuthenticated
    ) {
      return true;
    }
    return false;
  });
}
