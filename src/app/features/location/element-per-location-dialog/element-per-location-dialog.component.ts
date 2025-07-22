import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Element,
  ElementType,
  labelElementType,
} from '@app/features/element/models';
import { ElementService } from '@app/features/element/element.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HiredServiceService } from '@app/features/hired-service/hired-service.service';
import { HiredService } from '@app/features/hired-service/models';
import { ElementPerLocationService } from '../element-per-location.service';
import { ElementPerLocation } from '../models';
import { Sector } from '@app/features/sector/models';
import { startWith, tap } from 'rxjs';
import { SnackBarService } from '@app/core/services/snack-bar.service';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatDialogModule,
];

@Component({
  selector: 'app-elements-per-location-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MATERIAL_MODULES,
  ],
  templateUrl: './element-per-location-dialog.component.html',
  styleUrl: './element-per-location-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementPerLocationDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ElementPerLocationDialogComponent>);
  readonly data = inject<{
    isNew: boolean;
    elementPerLocation: ElementPerLocation;
  }>(MAT_DIALOG_DATA);
  private formBuilder = inject(FormBuilder);
  private elementService = inject(ElementService);
  private hiredServiceService = inject(HiredServiceService);
  private elementPerLocationService = inject(ElementPerLocationService);
  private snackBar = inject(SnackBarService);

  closeDialog = signal('nothing');
  labelElementType = labelElementType;
  form!: FormGroup;

  elementType = signal<ElementType | null>(null);
  elementTypeControl = new FormControl('', Validators.required);
  filteredlocations = toSignal(
    this.elementTypeControl.valueChanges.pipe(
      startWith(null),
      tap(value => this.elementType.set(value as ElementType | null))
    ),
    { initialValue: null as ElementType | null }
  );

  private _elements = toSignal(this.elementService.getAllElements(), {
    initialValue: [] as Element[],
  });

  elements = computed(() => {
    const type = this.elementType();
    if (type) {
      this.form.get('element')?.enable();
      return this._elements().filter(element => element.elementType === type);
    } else {
      this.form.get('element')?.disable();
      return [];
    }
  });

  private hiredServices = toSignal(
    this.hiredServiceService.getAllHiredServicesWithSectors(),
    {
      initialValue: [] as HiredService[],
    }
  );

  sectors = computed(() => {
    const type = this.elementType();

    if (type && this.hiredServices().length > 0) {
      const hiredService = this.hiredServices().filter(
        hs => hs.hiredServiceType === type
      );
      if (hiredService.length === 0) {
        this.form.get('sectors')?.disable();
        return [];
      }
      this.form.get('sectors')?.enable();
      return hiredService[0].sectors;
    } else {
      this.form.get('sectors')?.disable();
      return [];
    }
  });

  elementTypes = Object.values(ElementType);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      location: [this.data.elementPerLocation.location],
      element: [{ value: '', disabled: true }, Validators.required],
      sectors: [{ value: '', disabled: true }, Validators.required],
    });

    if (!this.data.isNew) {
      this.elementType.set(
        this.data.elementPerLocation.element.elementType as ElementType
      );
      this.form
        .get('element')
        ?.setValue(this.data.elementPerLocation.element.id);
      this.getSectorIDs();
    }
  }

  onSelectEvent(value: ElementType | null): void {
    this.elementType.set(value);
  }

  getSectorIDs() {
    const sectorIds: string[] = [];
    this.data.elementPerLocation.sectors.forEach(sector => {
      sectorIds.push(sector.id);
    });
    this.form.get('sectors')?.setValue(sectorIds);
  }

  getDataFromForm(): ElementPerLocation | Omit<ElementPerLocation, 'id'> {
    const { location, element, numberElements, sectors } = this.form.value;
    const arraySectors: Sector[] = [];
    sectors.forEach((id: string) => {
      const sector = this.sectors()?.find(s => s.id === id);
      if (sector) {
        arraySectors.push(sector);
      }
    });
    const selectedElement = this.elements().find(e => e.id === element);
    if (!selectedElement) {
      this.snackBar.showToast('Element not found!');
    }
    if (!selectedElement) {
      throw new Error('Selected element is undefined');
    }

    this.form.reset();

    return {
      location,
      numberElements,
      element: selectedElement,
      sectors: arraySectors,
    };
  }

  getTittle() {
    return this.data.isNew
      ? $localize`:@@element.create:Create a new Element`
      : $localize`:@@element.update:Update Element`;
  }

  emitAction() {
    if (!this.form.valid || this.form.get('element')?.disabled) {
      this.elementTypeControl.markAsTouched();
      return;
    }

    if (this.data.isNew) {
      this.elementPerLocationService
        .createElementPerLocation(this.getDataFromForm())
        .subscribe({
          next: () => {
            this.snackBar.showToast(
              `elementsPerLocation Service creado con éxito!`
            );
            this.closeDialog.set('created');
            this.dialogRef.close(this.closeDialog());
          },
          error: err => {
            console.log('error', err);
            this.closeDialog.set('error');
          },
        });
    } else {
      this.elementPerLocationService
        .updateElementPerLocation(
          this.data.elementPerLocation.id,
          this.getDataFromForm()
        )
        .subscribe({
          next: () => {
            this.snackBar.showToast(
              `elementsPerLocation Service creado con éxito!`
            );
            this.closeDialog.set('created');
            this.dialogRef.close(this.closeDialog());
          },
          error: err => {
            console.log('error', err);
            this.closeDialog.set('error');
          },
        });
    }
  }
}
