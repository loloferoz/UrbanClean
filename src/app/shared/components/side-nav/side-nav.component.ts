import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { AuthService } from '@app/features/auth/auth.service';
import { UserRole } from '@app/features/user/models';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ResponsiveService } from '@app/core/services/responsive.service';
import { MatCardModule } from '@angular/material/card';
import { ThemeService } from '@app/core/services/theme.service';
import { environment } from 'src/environments/environment';

const MATERIAL_MODULES = [
  MatListModule,
  MatIconModule,
  MatCardModule,
  MatDividerModule,
];

export interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MATERIAL_MODULES],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {
  private readonly authService = inject(AuthService);
  readonly responsiveService = inject(ResponsiveService);
  readonly themeService = inject(ThemeService);
  user = this.authService.user;
  authStatus = this.authService.authStatus;
  userRole = UserRole;
  private managerURL = 'manager';
  private operatorURL = 'operator';
  readonly documentUrl = `${environment.baseUrl}/doc/document.pdf`;
  isLargeWidth = input<boolean | undefined>(undefined);

  sideNavToggled = output<void>();
  menuManager = [
    {
      icon: 'list_alt',
      label: $localize`:@@word.controls:Controls`,
      route: this.managerURL + '/control',
    },
    {
      icon: 'recycling',
      label: $localize`:@@word.elements:Elements`,
      route: this.managerURL + '/element',
    },
    {
      icon: 'cleaning_services',
      label: $localize`:@@word.hired_services:Services`,
      route: this.managerURL + '/hired-service',
    },
    {
      icon: 'notifications',
      label: $localize`:@@word.incidents:Incidents`,
      route: this.managerURL + '/incident',
    },
    {
      icon: 'location_on',
      label: $localize`:@@word.locations:Locations`,
      route: this.managerURL + '/location',
    },
    {
      icon: 'space_dashboard',
      label: $localize`:@@word.sectors:Sectors`,
      route: this.managerURL + '/sector',
    },
    {
      icon: 'groups',
      label: $localize`:@@word.operators:Operators`,
      route: this.managerURL + '/user',
    },
    {
      icon: 'work',
      label: $localize`:@@word.work_days:Work Days`,
      route: this.managerURL + '/work-day',
    },
  ];

  menuOperator = [
    {
      icon: 'delete',
      label: $localize`:@@word.litter_bin:Litter Bin`,
      route: this.operatorURL + '/control-litter-bin',
    },
    {
      icon: 'laSolidDumpster',
      label: $localize`:@@word.organic:Organic`,
      route: this.operatorURL + '/control-organic',
    },
    {
      icon: 'water_bottle_large',
      label: $localize`:@@word.plastic:Plastic`,
      route: this.operatorURL + '/control-plastic',
    },
    {
      icon: 'note_stack',
      label: $localize`:@@word.cardboard:Cardboard`,
      route: this.operatorURL + '/control-cardboard',
    },
    {
      icon: 'liquor',
      label: $localize`:@@word.glass:Glass`,
      route: this.operatorURL + '/control-glass',
    },
    {
      icon: 'notifications',
      label: $localize`:@@word.incidents:Incidents`,
      route: this.operatorURL + '/incident',
    },
  ];

  toggleSidebar() {
    if (this.isLargeWidth()) {
      return;
    }
    this.sideNavToggled.emit();
  }
}
