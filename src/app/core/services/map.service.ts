import { inject, Injectable, signal } from '@angular/core';
import { MapGeocoder } from '@angular/google-maps';
import { defaultLocation, Location } from '@app/features/location/models';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { map, Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private geocoder = inject(MapGeocoder);
  protected geolocation$ = inject(GeolocationService);
  center = signal<Omit<Location, 'id'>>(defaultLocation);
  isRemoveProximityRestriction = signal<boolean>(false);

  setProximityRestriction(isProximityRestriction: boolean) {

    this.isRemoveProximityRestriction.set(isProximityRestriction);
  }

  getAddress(
    coords: google.maps.LatLngLiteral
  ): Observable<Omit<Location, 'id'>> {
    return this.geocoder.geocode({ location: coords }).pipe(
      map(address => {
        const location: Omit<Location, 'id'> = {
          city: '',
          street: '',
          number: 0,
          latitude: coords.lat,
          longitude: coords.lng,
        };

        if (address.status == google.maps.GeocoderStatus.OK) {
          let arrayaddress = address.results[0].formatted_address.split(',');

          if (!arrayaddress[2]) {
            arrayaddress = address.results[1].formatted_address.split(',');
          }

          if (arrayaddress[2]) {
            const city = arrayaddress[2].split(' ');
            location.street = arrayaddress[0] || '';
            location.number = +arrayaddress[1] || 0;
            location.city = city[2] || '';
          }
        }
        return location;
      })
    );
  }

  getCoords() {
    return this.geocoder.geocode({
      address: 'Carrer Sant Llorenç, 27, 03820 Cocentaina, Alicante, España',
    });
  }

  setCenter(location: Omit<Location, 'id'>) {
    this.center.set(location);
  }

  setCenterFromCurrentPosition() {
    this.geolocation$
      .pipe(
        take(1),
        tap(location => {
          this.center.update(currentPosition => ({
            ...currentPosition,
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          }));
        })
      )
      .subscribe();
  }

  setCenterByCalculateLocations(locations: Location[]) {
    if (locations.length == 0) {
      return;
    }
    const mid = Math.floor(locations.length / 2);
    const latitudes = [...locations].sort(
      (a: Location, b: Location) => a.latitude - b.latitude
    );
    const longitudes = [...locations].sort(
      (a: Location, b: Location) => a.longitude - b.longitude
    );
    this.center.set({
      ...defaultLocation,
      latitude: +latitudes[mid]?.latitude,
      longitude: +longitudes[mid]?.longitude,
    });
  }

  getDistanceBetweenLocations(
    distance: number,
    currentPosition: Omit<Location, 'id'>,
    element: Location
  ): boolean {
    const currentSpot = {
      lat: currentPosition.latitude,
      lng: currentPosition.longitude,
    };
    const elementSpot = { lat: +element.latitude, lng: +element.longitude };
    const meter = google.maps.geometry.spherical.computeDistanceBetween(
      currentSpot,
      elementSpot
    );
    return distance > meter;
  }
}
