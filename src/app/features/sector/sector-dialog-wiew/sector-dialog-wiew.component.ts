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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Sector } from '../models';

const MATERIAL_MODULES = [MatButtonModule, MatDialogModule, MatIconModule];

@Component({
  selector: 'app-sector-dialog-wiew',
  standalone: true,
  imports: [MATERIAL_MODULES],
  templateUrl: './sector-dialog-wiew.component.html',
  styleUrl: './sector-dialog-wiew.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectorDialogWiewComponent {
  private readonly dialogRef = inject(MatDialogRef<SectorDialogWiewComponent>);
  private readonly data = inject<{ sector: Sector }>(MAT_DIALOG_DATA);

  sector = signal(this.data.sector);
}
