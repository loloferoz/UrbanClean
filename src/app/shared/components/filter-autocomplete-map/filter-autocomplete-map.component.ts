import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MapService } from '@app/core/services/map.service';
import { Location } from '@app/features/location/models';
import { startWith, tap } from 'rxjs';

const MATERIAL_MODULES = [
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,
];
@Component({
  selector: 'app-filter-autocomplete-map',
  imports: [ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './filter-autocomplete-map.component.html',
  styleUrl: './filter-autocomplete-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterAutocompleteMapComponent {
  private mapService = inject(MapService);
  locations = input<Location[]>([]);
  filterControl = new FormControl('');
  filter = output<string>();

  filteredlocations$ = toSignal(
    this.filterControl.valueChanges.pipe(
      startWith(''),
      tap(value => this.filter.emit(value || ''))
    ),
    { initialValue: '' as string }
  );

  filteredlocations = computed(() => {
    const locations = this.locations();
    if (this.filteredlocations$()) {
      return this.filterlocatiosns(this.filteredlocations$());
    }
    return locations;
  });

  setCenter(location: Location) {
    this.mapService.setCenter(location);
  }

  private filterlocatiosns(value: string | null): Location[] {
    const filterValue = (value ?? '').toLowerCase();
    return this.locations().filter(address =>
      address.street.toLowerCase().includes(filterValue)
    );
  }
}
