import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(
    private matIconReg: MatIconRegistry,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');

    this.matIconRegistry.addSvgIcon(
      'flag-gb',
      this.sanitizer.bypassSecurityTrustResourceUrl('app-icons/gb.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'flag-es',
      this.sanitizer.bypassSecurityTrustResourceUrl('app-icons/es.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'flag-ca',
      this.sanitizer.bypassSecurityTrustResourceUrl('app-icons/es-ct.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'angular-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('app-icons/angular.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'nestjs-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('app-icons/nestjs.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'pdf-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('app-icons/pdf.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'laSolidDumpster',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'app-icons/la-dumpster-solid.svg'
      )
    );

    this.matIconRegistry.addSvgIcon(
      'faSolidDumpster',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'app-icons/fa-dumpster-solid.svg'
      )
    );
  }
}
