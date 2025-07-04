import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ElementType } from '@app/features/element/models';
import { ControlMapComponent } from '../control-map/control-map.component';
import { LocationType, TypeLocationMap } from '@app/shared/models';

@Component({
  selector: 'app-control-cardboard',
  standalone: true,
  imports: [ControlMapComponent],
  templateUrl: './control-cardboard.component.html',
  styleUrl: './control-cardboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlCardboardComponent {
  elementType = signal(ElementType.CARDBOARD);
  typeLocationMap = signal<TypeLocationMap>({
    elementType: ElementType.CARDBOARD,
    LocationType: LocationType.CONTROL,
    icon: 'note_stack',
  });
}
