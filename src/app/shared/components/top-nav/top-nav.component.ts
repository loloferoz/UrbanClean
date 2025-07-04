import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  output,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { Theme, ThemeService } from '@app/core/services/theme.service';
import { Language, LanguageService } from '@app/core/services/language.service';
import { AuthService } from '@app/features/auth/auth.service';
import { AreaService } from '@app/features/area/area.service';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { environment } from 'src/environments/environment';
import { IncidentService } from '@app/features/incident/incident.service';

const MATERIAL_MODULES = [
  MatIcon,
  MatMenu,
  MatToolbar,
  MatBadgeModule,
  MatButtonModule,
  MatDividerModule,
  MatMenuModule,
  MatListModule,
];

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [RouterLink, MATERIAL_MODULES],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopNavComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly areaService = inject(AreaService);
  private readonly incidentService = inject(IncidentService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  languageService = inject(LanguageService);
  themeService = inject(ThemeService);

  sideNavToggled = output<void>();
  languages = Language;
  themes = Theme;

  authStatus = this.authService.authStatus;
  user = this.authService.user;
  area = this.areaService.area;
  countIncidents = this.incidentService.countIncidencias;
  incidents = this.incidentService.incidents;

  ngOnInit(): void {
    if (
      environment.production &&
      this.languageService.currentLanguage() &&
      !location.pathname.includes(this.languageService.currentLanguage())
    ) {
      this.document.location.href = `/${this.languageService.currentLanguage()}`;
    }
  }

  toggleSidebar() {
    this.sideNavToggled.emit();
  }

  changeLanguage(language: Language) {
    this.languageService.updateLanguage(language);
    this.document.location.href = `/${language}${this.router.url}`;
  }
}
