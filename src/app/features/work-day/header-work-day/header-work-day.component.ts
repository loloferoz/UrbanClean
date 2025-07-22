import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ResponsiveService } from '@app/core/services/responsive.service';

const MATERIAL_MODULES = [
  MatInputModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatButtonModule,
  MatIconModule,
];

@Component({
  selector: 'app-header-work-day',
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, FormsModule, MATERIAL_MODULES],
  templateUrl: './header-work-day.component.html',
  styleUrl: './header-work-day.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderWorkDayComponent {
  private readonly responsiveService = inject(ResponsiveService);

  isSmallWidth = this.responsiveService.smallWidth;
  iconCreate = input<string>('');
  labelCreate = input<string>('');
  newItem = output<void>();
  day = output<Date>();
  filter = model('');

  create() {
    this.newItem.emit();
  }
  setDay(date: MatDatepickerInputEvent<Date>) {
    if (date.value) {
      this.day.emit(date.value);
    }
  }
}
