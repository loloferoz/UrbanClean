import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Control, labelControlStatus } from '../models';
import { ImagePathPipe } from '@app/shared/pipes/image-path.pipe';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatChipsModule,
];

@Component({
  selector: 'app-control-dialog-view',
  imports: [ImagePathPipe, MATERIAL_MODULES],
  templateUrl: './control-dialog-view.component.html',
  styleUrl: './control-dialog-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlDialogViewComponent {
  private readonly dialogRef = inject(MatDialogRef<ControlDialogViewComponent>);
  private readonly data = inject<{ control: Control }>(MAT_DIALOG_DATA);

  control = signal(this.data.control);
  labelControlStatus = labelControlStatus;
}
