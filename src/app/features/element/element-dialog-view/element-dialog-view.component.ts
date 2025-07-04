import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Element, labelElementType } from '../models';
import { ImagePathPipe } from '@app/shared/pipes/image-path.pipe';
import { MatChipsModule } from '@angular/material/chips';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatChipsModule,
];

@Component({
  selector: 'app-element-dialog-wiew',
  standalone: true,
  imports: [ImagePathPipe, MATERIAL_MODULES],
  templateUrl: './element-dialog-view.component.html',
  styleUrl: './element-dialog-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementDialogViewComponent {
  private readonly dialogRef = inject(MatDialogRef<ElementDialogViewComponent>);
  private readonly data = inject<{ element: Element }>(MAT_DIALOG_DATA);

  element = signal(this.data.element);
  labelElementType = labelElementType;
}
