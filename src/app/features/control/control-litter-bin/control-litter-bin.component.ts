import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ElementType } from '@app/features/element/models';
import { ControlMapComponent } from '../control-map/control-map.component';
import { LocationType, TypeLocationMap } from '@app/shared/models';

@Component({
  selector: 'app-control-litter-bin',
  standalone: true,
  imports: [ControlMapComponent],
  templateUrl: './control-litter-bin.component.html',
  styleUrl: './control-litter-bin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlLitterBinComponent {
  elementType = signal(ElementType.LITTER_BIN);
  typeLocationMap = signal<TypeLocationMap>({
    elementType: ElementType.LITTER_BIN,
    LocationType: LocationType.CONTROL,
    icon: 'delete',
  });
}
