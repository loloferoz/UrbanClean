import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HiredService } from '../models';
import { HiredServiceService } from '../hired-service.service';
import { toSignal } from '@angular/core/rxjs-interop';

const MATERIAL_MODULES = [MatButtonModule, MatDialogModule, MatIconModule];

@Component({
  selector: 'app-hired-service-dialog-wiew',
  standalone: true,
  imports: [MATERIAL_MODULES],
  templateUrl: './hired-service-dialog-wiew.component.html',
  styleUrl: './hired-service-dialog-wiew.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HiredServiceDialogWiewComponent {
  private readonly dialogRef = inject(
    MatDialogRef<HiredServiceDialogWiewComponent>
  );
  private readonly data = inject<{ hiredService: HiredService }>(
    MAT_DIALOG_DATA
  );
  private readonly hiredServiceService = inject(HiredServiceService);

  private hiredService$ = this.hiredServiceService.getHiredService(
    this.data.hiredService.id
  );
  hiredService = toSignal(this.hiredService$, {
    initialValue: {
      id: '',
      name: '',
      description: '',
      hiredServiceType: '',
      sectors: [],
    } as HiredService,
  });
}
