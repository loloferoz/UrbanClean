import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ElementType } from '@app/features/element/models';
import { ControlMapComponent } from '../control-map/control-map.component';
import { LocationType, TypeLocationMap } from '@app/shared/models';

@Component({
  selector: 'app-control-glass',
  standalone: true,
  imports: [ControlMapComponent],
  templateUrl: './control-glass.component.html',
  styleUrl: './control-glass.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlGlassComponent {
  elementType = signal(ElementType.GLASS);
  typeLocationMap = signal<TypeLocationMap>({
    elementType: ElementType.GLASS,
    LocationType: LocationType.CONTROL,
    icon: 'liquor',
  });
}
