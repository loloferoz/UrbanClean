import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ResponsiveService } from '@app/core/services/responsive.service';
import { TabMap } from '@app/shared/models';

const MATERIAL_MODULES = [MatButtonToggleModule];

@Component({
  selector: 'app-toggle-map',
  imports: [FormsModule, MATERIAL_MODULES],
  templateUrl: './toggle-map.component.html',
  styleUrl: './toggle-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleMapComponent {
  readonly responsiveService = inject(ResponsiveService);
  @Input({ required: true }) view!: TabMap;
  tabMap = TabMap;
  viewChange = output<TabMap>();

  setView(view: TabMap) {
    this.viewChange.emit(view);
  }
}
