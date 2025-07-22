import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from './models';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly baseUrl = `${environment.baseUrl}/api/clients`;
  httpClient = inject(HttpClient);

  getMyClient(): Observable<Client> {
    return this.httpClient.get<Client>(`${this.baseUrl}/my-client`);
  }
}
