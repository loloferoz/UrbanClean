import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Location } from '../models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Element, ElementType } from '@app/features/element/models';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatChipsModule,
];

@Component({
  selector: 'app-location-dialog-view',
  imports: [MATERIAL_MODULES],
  templateUrl: './location-dialog-view.component.html',
  styleUrl: './location-dialog-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDialogViewComponent {
  private readonly dialogRef = inject(
    MatDialogRef<LocationDialogViewComponent>
  );
  private readonly data = inject<{ location: Location }>(MAT_DIALOG_DATA);

  location = signal(this.data.location);
  elementPerLocations = signal<Location['elementPerLocations']>(
    this.data.location.elementPerLocations || []
  );
  elementType = ElementType;

  getIcon(element: Element) {
    if (element.elementType === ElementType.LITTER_BIN) return 'delete';
    if (element.elementType === ElementType.GLASS) return 'liquor';
    if (element.elementType === ElementType.PLASTIC)
      return 'water_bottle_large';
    if (element.elementType === ElementType.CARDBOARD) return 'note_stack';
    return 'package_2';
  }
}
