import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MapService } from '@app/core/services/map.service';

import {
  ContractCategory,
  labelContractCategory,
  labelUserRole,
  UserRole,
} from '@app/features/user/models';

@Component({
  selector: 'app-login-bottom-sheet',
  standalone: true,
  imports: [MatListModule, MatIconModule, MatSlideToggleModule],
  templateUrl: './login-bottom-sheet.component.html',
  styleUrl: './login-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginBottomSheetComponent {
  private bottomSheetRef =
    inject<MatBottomSheetRef<LoginBottomSheetComponent>>(MatBottomSheetRef);

  mapService = inject(MapService)

  userRole = UserRole;
  labelUserRole = labelUserRole;

  contractCategory = ContractCategory;
  labelContractCategory = labelContractCategory;

  setUser(user: UserRole | ContractCategory, event: MouseEvent) {
    this.bottomSheetRef.dismiss({ userSelected: user, element: null });
    event.preventDefault();
  }
}
