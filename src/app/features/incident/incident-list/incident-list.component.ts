import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { IncidentService } from '../incident.service';
import {
  Incident,
  labelIncidentPriority,
  labelIncidentStatus,
} from '../models';
import {
  ActionMap,
  ActionType,
  DataMap,
  TableAction,
  TableColumns,
} from '@app/shared/models';
import { BaseTableComponent } from '@app/shared/components/base-table/base-table.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { SnackBarService } from '@app/core/services/snack-bar.service';
import { MapService } from '@app/core/services/map.service';

@Component({
  selector: 'app-incident-list',
  imports: [BaseTableComponent],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentListComponent implements OnInit {
  private readonly incidentService = inject(IncidentService);
  private readonly snackBar = inject(SnackBarService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mapService = inject(MapService);

  private laberIncidentPriority = labelIncidentPriority;
  private labelIncidentStatus = labelIncidentStatus;
  dataMap = output<DataMap>();
  incidents = signal<Incident[]>([]);
  tableIncidents = computed(() =>
    this.incidents().map(incident => ({
      id: incident.id,
      description: incident.description,
      start: incident.start,
      time: incident.start,
      createdDate: incident.start,
      firstImage: incident.firstImage ? incident.firstImage.path : '',
      lastImage: incident.lastImage ? incident.lastImage.path : '',
      observation: incident.observation,
      incidentStatus: this.labelIncidentStatus.get(incident.incidentStatus),
      incidentPriority: this.laberIncidentPriority.get(
        incident.incidentPriority
      ),
      whoCreatedIt:
        incident.whoCreatedIt.name + ' ' + incident.whoCreatedIt.surname,
      whoIsResponsible: incident.whoIsResponsible
        ? incident.whoIsResponsible.name +
          ' ' +
          incident.whoIsResponsible.surname
        : '',
    }))
  );

  valueFiltered = input<string>('');

  private readonly columns: string[] = [
    'start',
    'description',
    'observation',
    'incidentStatus',
    'incidentPriority',
    'whoCreatedIt',
    'whoIsResponsible',
    'action',
  ];
  private readonly labels: string[] = [
    $localize`:@@word.date:Date`,
    $localize`:@@word.description:Description`,
    $localize`:@@word.observation:Observation`,
    $localize`:@@word.incident_status: Status of incidence `,
    $localize`:@@word.incident_priority:Priority of incidence`,
    $localize`:@@word.who_created_it:Incident creator`,
    $localize`:@@word.who_is_responsible:Incident manager`,
    $localize`:@@word.action:Action`,
  ];
  private readonly sortables: string[] = [
    'start',
    'description',
    'observation',
    'incidentStatus',
    'incidentPriority',
    'whoCreatedIt',
    'whoIsResponsible',
    'action',
  ];

  tableColumns: TableColumns = {
    columns: [...this.columns],
    labels: [...this.labels],
    sortables: [...this.sortables],
    chips: ['incidentStatus', 'incidentPriority'],
    date: ['start'],
    time: ['time'],
    actions: {
      update: true,
      view: true,
      delete: true,
    },
  };

  ngOnInit(): void {
    this.getAllIncidents();
  }

  getAllIncidents() {
    this.incidentService
      .getAllIncident()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((incidents: Incident[]) => {
          this.incidents.set(incidents);
        })
      )
      .subscribe();
  }

  public action(data: TableAction) {
    switch (data.action) {
      case ActionType.UPDATE: {
        const incidence = this.incidents().find(
          (incident: Incident) => incident.id === data.id
        );
        if (incidence && incidence.location) {
          const currentLocation = incidence.location;
          const location = { ...incidence.location, incident: incidence };
          this.mapService.setCenter(currentLocation);
          this.dataMap.emit({
            action: ActionMap.UPDATE,
            currentLocation: currentLocation,
            location: location,
          });
        }
        return;
      }
      case ActionType.VIEW: {
        const incidence = this.incidents().find(
          (incident: Incident) => incident.id === data.id
        );
        if (incidence && incidence.location) {
          const currentLocation = incidence.location;
          const location = { ...incidence.location, incident: incidence };
          this.mapService.setCenter(currentLocation);
          this.dataMap.emit({
            action: ActionMap.VIEW,
            currentLocation: currentLocation,
            location: location,
          });
        }
        return;
      }
      case ActionType.DELETE: {
        this.incidentService.deleteIncident(data?.id).subscribe({
          next: () => {
            this.snackBar.showToast(
              $localize`:@@incident.deleted:Deleted Incidence`
            );
            this.getAllIncidents();
          },
          error: err => console.log('error', err),
        });
        return;
      }
      default:
        return;
    }
  }
}
