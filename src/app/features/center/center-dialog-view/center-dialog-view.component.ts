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
import { Center, labelCenterType } from '../models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatChipsModule,
];

@Component({
  selector: 'app-center-dialog-view',
  standalone: true,
  imports: [MATERIAL_MODULES],
  templateUrl: './center-dialog-view.component.html',
  styleUrl: './center-dialog-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterDialogViewComponent {
  private readonly dialogRef = inject(MatDialogRef<CenterDialogViewComponent>);
  private readonly data = inject<{ center: Center }>(MAT_DIALOG_DATA);

  center = signal(this.data.center);
  labelCenterType = labelCenterType;
}
