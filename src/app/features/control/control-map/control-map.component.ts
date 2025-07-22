import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MapService } from '@app/core/services/map.service';
import { ElementType } from '@app/features/element/models';
import { LocationService } from '@app/features/location/location.service';
import { Location } from '@app/features/location/models';
import { WorkDay } from '@app/features/work-day/models';
import { WorkDayService } from '@app/features/work-day/work-day.service';
import { ActionMap, DataMap, TypeLocationMap } from '@app/shared/models';
import { tap } from 'rxjs';
import { Control, ControlStatus } from '../models';
import { ControlBottomSheetComponent } from '../control-bottom-sheet/control-bottom-sheet.component';
import { ControlDialogEditComponent } from '../control-dialog-edit/control-dialog-edit.component';
import { ViewMapComponent } from '@app/shared/components/view-map/view-map.component';
import { SnackBarService } from '@app/core/services/snack-bar.service';
import { FilterAutocompleteMapComponent } from '@app/shared/components/filter-autocomplete-map/filter-autocomplete-map.component';

@Component({
  selector: 'app-control-map',
  imports: [FilterAutocompleteMapComponent, ViewMapComponent],
  templateUrl: './control-map.component.html',
  styleUrl: './control-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlMapComponent implements OnInit {
  private readonly snackBarService = inject(SnackBarService);
  private readonly locationService = inject(LocationService);
  private readonly workDayService = inject(WorkDayService);
  private readonly mapService = inject(MapService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly bottomSheet = inject(MatBottomSheet);

  elementTypeSelected = input.required<ElementType>();
  typeLocationMap = input.required<TypeLocationMap>();

  locations = signal<Location[]>([]);

  valueToFilter = signal<string>('');

  private workDay$ = this.workDayService.getMyWorkDay();
  private workDay = toSignal(this.workDay$, {
    initialValue: { id: '', day: '', start: '', finish: '' } as WorkDay,
  });

  ngOnInit(): void {
    this.getAllLocations();
  }

  getAllLocations() {
    this.locationService
      .getAllLocationsByElement(this.elementTypeSelected())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((locations: Location[]) => {
          this.locations.set(locations);
          this.mapService.setCenterFromCurrentPosition();
        })
      )
      .subscribe();
  }

  setFilter(value: string) {
    this.valueToFilter.set(value);
  }

  action(data: DataMap) {
    if (data.action === ActionMap.CREATE) {
      if (
        this.workDay().hiredService.hiredServiceType !==
        this.elementTypeSelected()
      ) {
        this.snackBarService.showToast(
          $localize`:@@control.error.hiredServiceType:You cannot create a control for this Work Day`
        );
        return;
      }

      if (data.location && data.location.elementPerLocations?.length === 1) {
        const control = {
          controlStatus: ControlStatus.UNFINISHED,
          elementPerLocation: data.location.elementPerLocations[0],
          workDay: this.workDay(),
        };
        this.getDialog(control);
      } else {
        const bottomSheetRef = this.bottomSheet.open(
          ControlBottomSheetComponent,
          {
            data: { location: data.location },
          }
        );

        bottomSheetRef.afterDismissed().subscribe(elementPerLocation => {
          if (!elementPerLocation) {
            return;
          }
          const control = {
            controlStatus: ControlStatus.UNFINISHED,
            elementPerLocation,
            workDay: this.workDay(),
          };
          this.getDialog(control);
        });
      }
    }
  }

  getDialog(control: Control | Omit<Control, 'id' | 'image'> | undefined) {
    const dialogRef = this.dialog.open(ControlDialogEditComponent, {
      data: {
        control: control,
      },
      width: '480px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.snackBarService.showToast(
          $localize`:@@control.created:Created Control`
        );
        this.getAllLocations();
      }
      if (result === 'updated') {
        this.snackBarService.showToast(
          $localize`:@@control.updated:Updated Control`
        );
        this.getAllLocations();
      }
    });
  }
}
