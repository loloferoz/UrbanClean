import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ElementPerLocation, Location } from '../models';
import { MatIconModule } from '@angular/material/icon';
import { Element, ElementType } from '@app/features/element/models';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatBottomSheetModule,
  MatListModule,
  MatIconModule,
];

@Component({
  selector: 'app-location-bottom-sheet',
  standalone: true,
  imports: [MATERIAL_MODULES],
  templateUrl: './location-bottom-sheet.component.html',
  styleUrl: './location-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationBottomSheetComponent {
  private bottomSheetRef =
    inject<MatBottomSheetRef<LocationBottomSheetComponent>>(MatBottomSheetRef);
  data = inject<{ location: Location }>(MAT_BOTTOM_SHEET_DATA);
  elementType = ElementType;

  getLocation(event: MouseEvent): void {
    this.bottomSheetRef.dismiss({ isLocation: true, element: null });
    event.preventDefault();
  }

  getElement(elementsPerLocation: ElementPerLocation, event: MouseEvent): void {
    this.bottomSheetRef.dismiss({
      isLocation: false,
      elementsPerLocation: elementsPerLocation,
    });
    event.preventDefault();
  }

  getIcon(element: Element) {
    if (element.elementType === ElementType.LITTER_BIN) return 'delete';
    if (element.elementType === ElementType.GLASS) return 'liquor';
    if (element.elementType === ElementType.PLASTIC)
      return 'water_bottle_large';
    if (element.elementType === ElementType.CARDBOARD) return 'note_stack';
    return 'package_2';
  }
}
