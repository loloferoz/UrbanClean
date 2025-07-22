import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ElementPerLocation, Location } from '@app/features/location/models';

const MATERIAL_MODULES = [MatButtonModule, MatBottomSheetModule, MatListModule];

@Component({
  selector: 'app-control-bottom-sheet',
  imports: [MATERIAL_MODULES],
  templateUrl: './control-bottom-sheet.component.html',
  styleUrl: './control-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlBottomSheetComponent {
  private bottomSheetRef =
    inject<MatBottomSheetRef<ControlBottomSheetComponent>>(MatBottomSheetRef);
  data = inject<{ location: Location }>(MAT_BOTTOM_SHEET_DATA);

  getElement(elementPerLocation: ElementPerLocation, event: MouseEvent): void {
    this.bottomSheetRef.dismiss({
      elementsPerLocation: elementPerLocation,
    });
    event.preventDefault();
  }
}
