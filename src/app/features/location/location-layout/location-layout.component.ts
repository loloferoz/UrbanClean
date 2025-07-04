import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { LocationService } from '../location.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ElementPerLocation, Location } from '../models';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { LocationListComponent } from '../location-list/location-list.component';
import { ResponsiveService } from '@app/core/services/responsive.service';
import { ToggleMapComponent } from '@app/shared/components/toggle-map/toggle-map.component';
import { FilterAutocompleteMapComponent } from '@app/shared/components/filter-autocomplete-map/filter-autocomplete-map.component';
import {
  ActionMap,
  DataMap,
  LocationType,
  TabMap,
  TypeLocationMap,
} from '@app/shared/models';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MapService } from '@app/core/services/map.service';
import { MatDialog } from '@angular/material/dialog';
import { LocationDialogComponent } from '../location-dialog/location-dialog.component';
import { ElementPerLocationDialogComponent } from '../element-per-location-dialog/element-per-location-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LocationBottomSheetComponent } from '../location-bottom-sheet/location-bottom-sheet.component';
import { ViewMapComponent } from '@app/shared/components/view-map/view-map.component';
import { SnackBarService } from '@app/core/services/snack-bar.service';
import { LocationDialogViewComponent } from '../location-dialog-view/location-dialog-view.component';

const MATERIAL_MODULES = [MatButtonToggleModule, MatIconModule];

@Component({
  selector: 'app-location-layout',
  standalone: true,
  imports: [
    ToggleMapComponent,
    FilterAutocompleteMapComponent,
    LocationListComponent,
    ViewMapComponent,
    CommonModule,
    MATERIAL_MODULES,
  ],
  templateUrl: './location-layout.component.html',
  styleUrl: './location-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationLayoutComponent implements OnInit {
  readonly responsiveService = inject(ResponsiveService);
  private readonly locationService = inject(LocationService);
  private readonly mapService = inject(MapService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly destroyRef = inject(DestroyRef);

  dialog = inject(MatDialog);
  bottomSheet = inject(MatBottomSheet);

  tabMap = TabMap;
  viewTable = signal(false);
  viewMap = signal(true);
  valueToFilter = signal<string>('');

  locations = signal<Location[]>([]);
  typeLocationMap = signal<TypeLocationMap>({
    elementType: null,
    LocationType: LocationType.ELEMENTS,
    icon: null,
  });

  ngOnInit(): void {
    this.getAllLocations();
  }

  getAllLocations() {
    this.locationService
      .getAllLocations()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((locations: Location[]) => {
          this.locations.set(locations);
          this.mapService.setCenterByCalculateLocations(locations);
        })
      )
      .subscribe();
  }

  changeView(view: TabMap) {
    switch (view) {
      case TabMap.TABLE:
        this.viewTable.set(true);
        this.viewMap.set(false);
        return;
      case TabMap.ALL:
        this.viewTable.set(true);
        this.viewMap.set(true);
        return;
      case TabMap.MAP:
        this.viewTable.set(false);
        this.viewMap.set(true);
    }
  }

  setFilter(value: string) {
    this.valueToFilter.set(value);
  }

  action(data: DataMap) {
    const { action, currentLocation, location } = { ...data };

    if (action === ActionMap.VIEW) {
      if (location) {
        this.dialog.open(LocationDialogViewComponent, {
          data: {
            location: location,
          },
          width: '420px',
        });
      }
    }

    if (action === ActionMap.CREATE) {
      if (currentLocation) {
        this.getLocationDialog(true, currentLocation);
      }
      if (location) {
        this.getElementsPerLocationDialog(true, {
          location,
        });
      }
    }

    if (action === ActionMap.UPDATE && location && currentLocation) {
      const bottomSheetRef = this.bottomSheet.open(
        LocationBottomSheetComponent,
        {
          data: { location },
        }
      );
      bottomSheetRef.afterDismissed().subscribe(data => {
        if (!data) {
          return;
        }

        if (data.isLocation) {
          const updateLocalization = {
            ...location,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          };

          this.getLocationDialog(false, updateLocalization);
        }

        if (!data.isLocation) {
          const elementsPerLocation = {
            ...data.elementsPerLocation,
            location: location,
          };

          this.getElementsPerLocationDialog(false, elementsPerLocation);
        }
      });
    }
  }

  getLocationDialog(
    isNew: boolean,
    location: Location | Omit<Location, 'id'> | undefined
  ) {
    const dialogRef = this.dialog.open(LocationDialogComponent, {
      data: {
        isNew: isNew,
        location: location,
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.snackBarService.showToast(
          $localize`:@@location.map.created:Created Location`
        );
        this.getAllLocations();
      }
      if (result === 'updated') {
        this.snackBarService.showToast(
          $localize`:@@location.map.updated:Updated Location`
        );
        this.getAllLocations();
      }
    });
  }

  getElementsPerLocationDialog(
    isNew: boolean,
    elementPerLocation: ElementPerLocation | { location: Location } | undefined
  ) {
    const dialogRef = this.dialog.open(ElementPerLocationDialogComponent, {
      data: {
        isNew: isNew,
        elementPerLocation: elementPerLocation,
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.snackBarService.showToast(
          $localize`:@@location.map.created:Created Location`
        );
        this.getAllLocations();
      }
      if (result === 'updated') {
        this.snackBarService.showToast(
          $localize`:@@location.map.updated:Updated Location`
        );
        this.getAllLocations();
      }
    });
  }
}
