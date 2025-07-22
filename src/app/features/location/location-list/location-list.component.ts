import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { Location } from '../models';
import { LocationService } from '../location.service';
import {
  ActionMap,
  ActionType,
  DataMap,
  TableAction,
  TableColumns,
} from '@app/shared/models';
import { BaseTableComponent } from '@app/shared/components/base-table/base-table.component';
import { SnackBarService } from '@app/core/services/snack-bar.service';
import { MapService } from '@app/core/services/map.service';

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [BaseTableComponent],
  templateUrl: './location-list.component.html',
  styleUrl: './location-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationListComponent {
  private readonly locationService = inject(LocationService);
  private readonly snackBar = inject(SnackBarService);
  private readonly mapService = inject(MapService);
  locations = input<Location[]>([]);

  valueFiltered = input<string>('');
  dataMap = output<DataMap>();

  private readonly columns: string[] = ['city', 'street', 'number', 'action'];
  private readonly labels: string[] = [
    $localize`:@@word.city:City`,
    $localize`:@@word.street:Street`,
    $localize`:@@word.number:Number`,
    $localize`:@@word.action:Action`,
  ];
  private readonly sortables: string[] = ['city', 'street', 'number'];

  tableColumns: TableColumns = {
    columns: [...this.columns],
    labels: [...this.labels],
    sortables: [...this.sortables],
    actions: {
      update: true,
      view: true,
      delete: false,
    },
  };

  public action(data: TableAction) {
    switch (data.action) {
      case ActionType.CREATE: {
        console.log(ActionType.CREATE);
        return;
      }
      case ActionType.UPDATE: {
        const location = this.locations().find(
          (location: Location) => location.id === data.id
        );
        if (location) {
          this.mapService.setCenter(location);
          this.dataMap.emit({
            action: ActionMap.UPDATE,
            currentLocation: location,
            location: location,
          });
        }
        return;
      }
      case ActionType.VIEW: {
        const location = this.locations().find(
          (location: Location) => location.id === data.id
        );
        if (location) {
          this.mapService.setCenter(location);
          this.dataMap.emit({
            action: ActionMap.VIEW,
            currentLocation: location,
            location: location,
          });
        }
        return;
      }
      case ActionType.DELETE: {
        console.log(ActionType.DELETE);
        return;
      }
      default:
        return;
    }
  }
}
