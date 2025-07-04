import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-area-detail',
  standalone: true,
  imports: [],
  templateUrl: './area-detail.component.html',
  styleUrl: './area-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaDetailComponent {}
