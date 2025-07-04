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
import {
  labelContractCategory,
  labelContractTurn,
  labelUserRole,
  User,
} from '../models';
import { DatePipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatChipsModule,
];

@Component({
  selector: 'app-user-dialog-wiew',
  standalone: true,
  imports: [MATERIAL_MODULES, DatePipe],
  templateUrl: './user-dialog-wiew.component.html',
  styleUrl: './user-dialog-wiew.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialogWiewComponent {
  private readonly dialogRef = inject(MatDialogRef<UserDialogWiewComponent>);
  private readonly data = inject<{ user: User }>(MAT_DIALOG_DATA);

  user = signal(this.data.user);
  labelUserRole = labelUserRole;
  labelContractCategory = labelContractCategory;
  labelContractTurn = labelContractTurn;
}
