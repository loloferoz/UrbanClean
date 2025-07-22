import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ElementType } from '@app/features/element/models';
import { ControlMapComponent } from '../control-map/control-map.component';
import { LocationType, TypeLocationMap } from '@app/shared/models';

@Component({
  selector: 'app-control-organic',
  standalone: true,
  imports: [ControlMapComponent],
  templateUrl: './control-organic.component.html',
  styleUrl: './control-organic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlOrganicComponent {
  elementType = signal(ElementType.ORGANIC);
  typeLocationMap = signal<TypeLocationMap>({
    elementType: ElementType.ORGANIC,
    LocationType: LocationType.CONTROL,
    icon: 'faSolidDumpster',
  });
}
