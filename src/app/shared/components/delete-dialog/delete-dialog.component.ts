import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

const MATERIAL_MODULES = [MatButtonModule, MatDialogModule];

@Component({
  selector: 'app-delete-dialog',
  imports: [MATERIAL_MODULES],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteDialogComponent>);
  readonly data = inject<{ content: string }>(MAT_DIALOG_DATA);
}
