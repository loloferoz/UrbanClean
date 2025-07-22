import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ToggleMapComponent } from '@app/shared/components/toggle-map/toggle-map.component';
import {
  ActionMap,
  DataMap,
  LocationType,
  TabMap,
  TypeLocationMap,
} from '@app/shared/models';
import { IncidentListComponent } from '../incident-list/incident-list.component';
import { CommonModule } from '@angular/common';
import { ViewMapComponent } from '@app/shared/components/view-map/view-map.component';
import { MatDialog } from '@angular/material/dialog';
import { IncidentDialogOperatorComponent } from '../incident-dialog-operator/incident-dialog-operator.component';
import { Location } from '@app/features/location/models';
import { LocationService } from '@app/features/location/location.service';
import { MapService } from '@app/core/services/map.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { AuthService } from '@app/features/auth/auth.service';
import { User, UserRole } from '@app/features/user/models';
import { IncidentDialogManagerComponent } from '../incident-dialog-manager/incident-dialog-manager.component';
import { ComponentType } from '@angular/cdk/overlay';
import { FilterAutocompleteMapComponent } from '@app/shared/components/filter-autocomplete-map/filter-autocomplete-map.component';
import { FilterTableComponent } from '@app/shared/components/filter-table/filter-table.component';
import { SnackBarService } from '@app/core/services/snack-bar.service';
import { IncidentDialogCompleteComponent } from '../incident-dialog-complete/incident-dialog-complete.component';
import { IncidentStatus } from '../models';
import { UserService } from '@app/features/user/user.service';
import { IncidentDialogViewComponent } from '../incident-dialog-view/incident-dialog-view.component';

@Component({
  selector: 'app-incident-layout',
  imports: [
    ToggleMapComponent,
    IncidentListComponent,
    FilterAutocompleteMapComponent,
    FilterTableComponent,
    ViewMapComponent,
    CommonModule,
  ],
  templateUrl: './incident-layout.component.html',
  styleUrl: './incident-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentLayoutComponent implements OnInit {
  private readonly snackBarService = inject(SnackBarService);
  private readonly locationService = inject(LocationService);
  private readonly authService = inject(AuthService);
  private readonly mapService = inject(MapService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);
  tabMap = TabMap;
  viewTable = signal(true);
  viewMap = signal(false);
  valueToFilter = signal<string>('');

  locations = signal<Location[]>([]);
  typeLocationMap = signal<TypeLocationMap>({
    elementType: null,
    LocationType: LocationType.INCIDENT,
    icon: 'fmd_bad',
  });

  users = toSignal(this.userService.getAllUsersByRole(UserRole.OPERATOR), {
    initialValue: [] as User[],
  });

  ngOnInit(): void {
    this.getAllLocations();
    if (this.authService.authStatus().userRole === UserRole.OPERATOR) {
      this.mapService.setCenterFromCurrentPosition();
    }
  }

  getAllLocations() {
    this.locationService
      .getAllLocationsWithIncident()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((locations: Location[]) => {
          if (this.authService.authStatus().userRole !== UserRole.OPERATOR) {
            this.mapService.setCenterByCalculateLocations(locations);
          }
          this.locations.set(locations);
        })
      )
      .subscribe();
  }

  changeView(view: TabMap) {
    switch (view) {
      case TabMap.TABLE:
        this.viewTable.set(true);
        this.viewMap.set(false);
        this.valueToFilter.set('');
        return;
      case TabMap.ALL:
        this.viewTable.set(true);
        this.viewMap.set(true);
        this.valueToFilter.set('');
        return;
      case TabMap.MAP:
        this.viewTable.set(false);
        this.viewMap.set(true);
        this.valueToFilter.set('');
    }
  }

  setFilter(value: string) {
    this.valueToFilter.set(value);
  }

  action(data: DataMap) {
    const { action, currentLocation, location } = { ...data };

    // console.log('currentLocation', currentLocation);
    // console.log('location', location);

    if (this.authService.authStatus().userRole === UserRole.OPERATOR) {
      if (action === ActionMap.CREATE && currentLocation) {
        this.getDialog(
          true,
          currentLocation,
          undefined,
          [],
          IncidentDialogOperatorComponent
        );
      }
      if (
        action === ActionMap.CREATE &&
        location &&
        data.location?.incident?.incidentStatus === IncidentStatus.DELEGATED
      ) {
        this.getDialog(
          false,
          undefined,
          location,
          [],
          IncidentDialogCompleteComponent
        );
      }
      if (
        action === ActionMap.UPDATE &&
        currentLocation &&
        location &&
        data.location?.incident?.incidentStatus === IncidentStatus.SENTED
      ) {
        this.getDialog(
          false,
          currentLocation,
          location,
          [],
          IncidentDialogOperatorComponent
        );
      }
    } else {
      if (action === ActionMap.CREATE && currentLocation) {
        this.getDialog(
          true,
          currentLocation,
          undefined,
          this.users(),
          IncidentDialogManagerComponent
        );
      }
      if (
        action === ActionMap.UPDATE &&
        currentLocation &&
        location &&
        data.location?.incident?.incidentStatus !== IncidentStatus.FINISHED
      ) {
        this.getDialog(
          false,
          currentLocation,
          location,
          this.users(),
          IncidentDialogManagerComponent
        );
      }
    }
    if (action === ActionMap.VIEW && location) {
      const incident = location.incident;
      if (incident) {
        incident.location = {
          city: location.city,
          street: location.street,
          number: location.number,
          id: location.id,
          latitude: location.latitude,
          longitude: location.longitude,
        };
        this.dialog.open(IncidentDialogViewComponent, {
          data: {
            incident: incident,
          },
          width: '420px',
        });
      }
    }
  }

  getDialog(
    isNew: boolean,
    currentLocation: Omit<Location, 'id'> | undefined,
    location: Location | undefined,
    users: User[],
    dialotRef: ComponentType<
      | IncidentDialogOperatorComponent
      | IncidentDialogManagerComponent
      | IncidentDialogCompleteComponent
    >
  ) {
    const dialogRef = this.dialog.open(dialotRef, {
      data: {
        isNew,
        currentLocation,
        location: location,
        users,
      },
      width: '550px',
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
