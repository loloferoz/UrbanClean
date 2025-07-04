import { BreakpointObserver } from '@angular/cdk/layout';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  private readonly small = '(max-width: 599px)';
  private readonly medium = '(min-width: 600px) and (max-width: 1024px)';
  private readonly large = '(min-width: 1025px)';

  private readonly breakpointObserver = inject(BreakpointObserver);

  private screenWidth = toSignal(
    this.breakpointObserver.observe([this.small, this.medium, this.large])
  );

  smallWidth = computed(() => this.screenWidth()?.breakpoints[this.small]);
  mediumWidth = computed(() => this.screenWidth()?.breakpoints[this.medium]);
  largeWidth = computed(() => this.screenWidth()?.breakpoints[this.large]);
}
