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
import {
  Incident,
  labelIncidentPriority,
  labelIncidentStatus,
} from '../models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { ImagePathPipe } from '@app/shared/pipes/image-path.pipe';
import { DatePipe } from '@angular/common';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatTabsModule,
  MatChipsModule,
];

@Component({
  selector: 'app-incident-dialog-view',
  imports: [ImagePathPipe, DatePipe, MATERIAL_MODULES],
  templateUrl: './incident-dialog-view.component.html',
  styleUrl: './incident-dialog-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentDialogViewComponent {
  private readonly dialogRef = inject(
    MatDialogRef<IncidentDialogViewComponent>
  );
  private readonly data = inject<{ incident: Incident }>(MAT_DIALOG_DATA);

  incident = signal(this.data.incident);
  labelIncidentPriority = labelIncidentPriority;
  labelIncidentStatus = labelIncidentStatus;
}
