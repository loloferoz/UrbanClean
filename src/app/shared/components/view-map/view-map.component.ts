import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  GoogleMap,
  GoogleMapsModule,
  MapAdvancedMarker,
} from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { MapService } from '@app/core/services/map.service';
import { ResponsiveService } from '@app/core/services/responsive.service';
import { SnackBarService } from '@app/core/services/snack-bar.service';
import { ThemeService } from '@app/core/services/theme.service';
import { ElementType } from '@app/features/element/models';
import {
  defaultLocation,
  ElementPerLocation,
  Location,
} from '@app/features/location/models';
import {
  ActionMap,
  ActionMove,
  configMap,
  DataMap,
  LocationType,
  TypeLocationMap,
} from '@app/shared/models';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { tap } from 'rxjs';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
];
@Component({
  selector: 'app-view-map',
  imports: [GoogleMapsModule, MapAdvancedMarker, NgClass, MATERIAL_MODULES],
  templateUrl: './view-map.component.html',
  styleUrl: './view-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewMapComponent implements OnInit, AfterViewInit {
  private readonly themeService = inject(ThemeService);
  protected readonly geolocation$ = inject(GeolocationService);
  private readonly router = inject(Router);
  private readonly snackBarService = inject(SnackBarService);
  readonly responsiveService = inject(ResponsiveService);
  readonly mapService = inject(MapService);

  map = viewChild(GoogleMap);
  menuType = viewChild<ElementRef>('menuType');
  searchInput = viewChild<ElementRef>('searchInput');
  bottonsAction = viewChild<ElementRef>('bottonsAction');
  cardSearch = viewChild<ElementRef>('cardSearch');
  menuZoom = viewChild<ElementRef>('menuZoom');

  zoom = signal(18);
  mapType = signal<google.maps.MapTypeId>(google.maps.MapTypeId.ROADMAP);
  options = signal<google.maps.MapOptions>({
    ...configMap,
    colorScheme: this.themeService.currentTheme(),
  });
  MapTypeId = google.maps.MapTypeId;

  locations = input<Location[]>([]);
  typeLocationMap = input.required<TypeLocationMap>();
  dataMap = output<DataMap>();

  center = this.mapService.center;
  currentPosition = signal(defaultLocation);
  newLocation = signal(defaultLocation);

  selectedAction = signal<ActionMap>(ActionMap.VIEW);
  draggable = signal(false);

  autocomplete: google.maps.places.Autocomplete | undefined;
  placeholder = signal('Enter address...');

  showMenu = signal(false);

  actionMap = ActionMap;
  actionMove = ActionMove;
  locationType = LocationType;
  elementType = ElementType;

  private setTheme = effect(() => {
    const url = this.router.url;
    if (this.options().colorScheme !== this.themeService.currentTheme()) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([url]);
      });
    }
  });

  ngOnInit(): void {
    this.geolocation$
      .pipe(
        tap(location => {
          this.currentPosition.update(currentPosition => ({
            ...currentPosition,
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          }));
        })
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.map()?.controls[google.maps.ControlPosition.TOP_LEFT].push(
      this.menuType()?.nativeElement
    );

    this.map()?.controls[google.maps.ControlPosition.TOP_RIGHT].push(
      this.cardSearch()?.nativeElement
    );

    this.map()?.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
      this.menuZoom()?.nativeElement
    );

    if (!this.typeLocationMap().elementType) {
      this.map()?.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
        this.bottonsAction()?.nativeElement
      );
    }

    this.searchPosition();
  }

  searchPosition() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.searchInput()?.nativeElement
    );

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      this.mapService.setCenter({
        ...this.center(),
        latitude: place?.geometry?.location?.lat() || 0,
        longitude: place?.geometry?.location?.lng() || 0,
      });
    });
  }

  setLocation(event: google.maps.MapMouseEvent) {
    this.showMenu.set(false);
    if (this.selectedAction() === ActionMap.MOVE) {
      return;
    }

    if (event.latLng != null || event.latLng !== undefined) {
      this.newLocation.set({
        ...this.newLocation(),
        latitude: event.latLng?.lat() || 0,
        longitude: event.latLng?.lng() || 0,
      });
    }
  }

  create(currentLocation: google.maps.MapMouseEvent) {
    if (this.selectedAction() === ActionMap.MOVE) {
      return;
    }

    const basicLocation = this.transformBasicLocation(currentLocation);
    this.newLocation.set({
      ...this.newLocation(),
      latitude: 0,
      longitude: 0,
    });
    this.dataMap.emit({
      action: ActionMap.CREATE,
      currentLocation: basicLocation,
      location: null,
    });
    this.selectedAction.set(this.actionMap.VIEW);
  }

  action(currentLocation: google.maps.MapMouseEvent, location: Location) {
    this.newLocation.set({
      ...this.newLocation(),
      latitude: 0,
      longitude: 0,
    });

    if (this.selectedAction() == this.actionMap.VIEW) {
      const basicLocation = this.transformBasicLocation(currentLocation);
      this.dataMap.emit({
        action: ActionMap.VIEW,
        currentLocation: basicLocation,
        location: location,
      });
    }

    if (this.selectedAction() == this.actionMap.CREATE) {
      this.dataMap.emit({
        action: ActionMap.CREATE,
        currentLocation: null,
        location: location,
      });
      this.selectedAction.set(this.actionMap.VIEW);
    }

    if (this.typeLocationMap().elementType) {
      if (
        this.mapService.isRemoveProximityRestriction() ||
        this.mapService.getDistanceBetweenLocations(
          25,
          this.currentPosition(),
          location
        )
      ) {
        this.dataMap.emit({
          action: ActionMap.CREATE,
          currentLocation: null,
          location: location,
        });
      } else {
        this.snackBarService.showToast(
          $localize`:@@map.not_close:You're not close enough`
        );
      }
    }

    if (this.selectedAction() == this.actionMap.UPDATE) {
      const basicLocation = this.transformBasicLocation(currentLocation);
      this.dataMap.emit({
        action: ActionMap.UPDATE,
        currentLocation: basicLocation,
        location: location,
      });
      this.selectedAction.set(this.actionMap.VIEW);
    }
  }

  updateZoom(zoom: number) {
    this.zoom.update(zm => zm + zoom);
  }

  moveCenter(action: ActionMove) {
    const height = this.map()?.googleMap?.getDiv().offsetHeight;
    const width = this.map()?.googleMap?.getDiv().offsetWidth;
    let x = 0,
      y = 0;

    if (action === ActionMove.UP) {
      y = height ? (height / 2) * -1 : 0;
    }
    if (action === ActionMove.DOWN) {
      y = height ? height / 2 : 0;
    }
    if (action === ActionMove.LEFT) {
      x = width ? (width / 2) * -1 : 0;
    }
    if (action === ActionMove.RIGHT) {
      x = width ? width / 2 : 0;
    }
    this.map()?.panBy(x, y);
  }

  updateCenter() {
    this.mapService.setCenter(this.currentPosition());
    this.map()?.panTo({
      lat: this.currentPosition().latitude,
      lng: this.currentPosition().longitude,
    });
  }

  chooseAction(action: ActionMap) {
    this.selectedAction.set(action);

    switch (action) {
      case this.actionMap.CREATE: {
        this.snackBarService.showToast(
          $localize`:@@map.create:Create mode activated`
        );
        this.draggable.set(false);
        return;
      }
      case this.actionMap.UPDATE: {
        this.snackBarService.showToast(
          $localize`:@@map.update:Update mode activated`
        );
        this.draggable.set(false);
        return;
      }
      case this.actionMap.MOVE: {
        this.snackBarService.showToast(
          $localize`:@@map.move:Drag mode activated`
        );
        this.draggable.set(true);
        return;
      }
      default:
        this.snackBarService.showToast(
          $localize`:@@map.view:View mode activated`
        );
        this.draggable.set(false);
        return;
    }
  }

  findElementType(
    epl: ElementPerLocation[] | undefined,
    type: ElementType
  ): boolean {
    if (epl === undefined) return false;
    const values = epl.find(el => el.element.elementType == type);
    if (values) return true;
    else return false;
  }

  transformBasicLocation(
    location: google.maps.MapMouseEvent
  ): Omit<Location, 'id'> {
    return {
      city: '',
      street: '',
      number: 0,
      latitude: location.latLng?.lat() || 0,
      longitude: location.latLng?.lng() || 0,
    };
  }
}
