import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

const MATERIAL_MODULES = [MatFormField, MatInput, MatLabel];

@Component({
  selector: 'app-filter-table',
  standalone: true,
  imports: [FormsModule, MATERIAL_MODULES],
  templateUrl: './filter-table.component.html',
  styleUrl: './filter-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterTableComponent {
  filter = model('');
}
