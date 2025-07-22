import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ElementType } from '@app/features/element/models';
import { ControlMapComponent } from '../control-map/control-map.component';
import { LocationType, TypeLocationMap } from '@app/shared/models';

@Component({
  selector: 'app-control-plastic',
  standalone: true,
  imports: [ControlMapComponent],
  templateUrl: './control-plastic.component.html',
  styleUrl: './control-plastic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPlasticComponent {
  elementType = signal(ElementType.PLASTIC);
  typeLocationMap = signal<TypeLocationMap>({
    elementType: ElementType.ORGANIC,
    LocationType: LocationType.CONTROL,
    icon: 'water_bottle_large',
  });
}
