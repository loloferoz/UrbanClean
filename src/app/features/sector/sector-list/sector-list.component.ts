import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { BaseTableComponent } from '@app/shared/components/base-table/base-table.component';
import { SectorService } from '../sector.service';
import { MatDialog } from '@angular/material/dialog';
import { Sector } from '../models';
import { ActionType, TableAction, TableColumns } from '@app/shared/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, mergeMap, tap } from 'rxjs';
import { SectorDialogEditComponent } from '../sector-dialog-edit/sector-dialog-edit.component';
import { FilterTableComponent } from '@app/shared/components/filter-table/filter-table.component';
import { HeaderTableComponent } from '@app/shared/components/header-table/header-table.component';
import { SectorDialogWiewComponent } from '../sector-dialog-wiew/sector-dialog-wiew.component';
import { SnackBarService } from '@app/core/services/snack-bar.service';
import { DeleteDialogComponent } from '@app/shared/components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-sector-list',
  standalone: true,
  imports: [BaseTableComponent, HeaderTableComponent, FilterTableComponent],
  templateUrl: './sector-list.component.html',
  styleUrl: './sector-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectorListComponent implements OnInit {
  private readonly sectorService = inject(SectorService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(SnackBarService);
  private readonly dialog = inject(MatDialog);

  iconCreate = 'add';
  labelCreate = $localize`:@@sector.add:Add new Sector`;

  sectors = signal<Sector[]>([]);
  tableSectors = computed(() =>
    this.sectors().map(sector => ({
      ...sector,
      hiredService: sector.hiredService?.name,
    }))
  );
  valueToFilter = signal<string>('');

  columns: string[] = ['name', 'description', 'hiredService', 'action'];
  labels: string[] = [
    $localize`:@@word.name:Name`,
    $localize`:@@word.description:Description`,
    $localize`:@@word.hired_service:Service`,
    $localize`:@@word.action:Action`,
  ];
  sortables: string[] = ['name', 'description', 'hiredService'];

  tableColumns: TableColumns = {
    columns: [...this.columns],
    labels: [...this.labels],
    sortables: [...this.sortables],
    actions: {
      update: true,
      view: false,
      delete: true,
    },
  };

  ngOnInit(): void {
    this.getAllSectors();
  }

  getAllSectors() {
    this.sectorService
      .getAllSector()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((sectors: Sector[]) => this.sectors.set(sectors))
      )
      .subscribe();
  }

  create() {
    const sector = {
      name: '',
      description: '',
    };
    this.getDialog(true, sector);
  }

  public action(data: TableAction) {
    const sector = this.sectors().find(s => s.id === data?.id);
    switch (data.action) {
      case ActionType.VIEW: {
        this.dialog.open(SectorDialogWiewComponent, {
          data: {
            sector: sector,
          },
        });
        return;
      }
      case ActionType.UPDATE: {
        this.getDialog(false, sector);
        return;
      }
      case ActionType.DELETE: {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          data: {
            content: $localize`:@@sector.delete:Are you sure you want to delete this Sector?`,
          },
        });

        dialogRef
          .afterClosed()
          .pipe(
            filter(result => result === true),
            mergeMap(() => this.sectorService.deleteSector(data?.id))
          )
          .subscribe({
            next: () => {
              this.snackBar.showToast(
                $localize`:@@sector.deleted:Deleted Sector`
              );
              this.getAllSectors();
            },
            error: err => console.log('error', err),
          });

        return;
      }
      default:
        return;
    }
  }

  getDialog(isNew: boolean, sector: Sector | Omit<Sector, 'id'> | undefined) {
    const dialogRef = this.dialog.open(SectorDialogEditComponent, {
      data: {
        isNew: isNew,
        sector: sector,
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.snackBar.showToast($localize`:@@sector.created:Created Sector`);
        this.getAllSectors();
      }
      if (result === 'updated') {
        this.snackBar.showToast($localize`:@@sector.updated:Updated Sector`);
        this.getAllSectors();
      }
    });
  }
}
