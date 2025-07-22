import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ResponsiveService } from '@app/core/services/responsive.service';
const MATERIAL_MODULES = [MatIcon, MatButtonModule];
@Component({
  selector: 'app-header-table',
  standalone: true,
  imports: [MATERIAL_MODULES],
  templateUrl: './header-table.component.html',
  styleUrl: './header-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderTableComponent {
  private readonly responsiveService = inject(ResponsiveService);
  iconCreate = input<string>('');
  labelCreate = input<string>('');
  showButtom = input<boolean>(true);
  newItem = output<void>();

  isSmallWidth = this.responsiveService.smallWidth;

  create() {
    this.newItem.emit();
  }
}
