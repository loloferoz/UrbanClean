import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MapAdvancedMarker } from '@angular/google-maps';

@Component({
  selector: 'app-test-component',
  standalone: true,
  imports: [MapAdvancedMarker],
  templateUrl: './test-component.component.html',
  styleUrl: './test-component.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponentComponent {
  latitude = input.required<number>();
  longitude = input.required<number>();
}
