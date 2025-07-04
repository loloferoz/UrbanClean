import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  templateUrl: './page-not-found.component.html',
  host: { class: 'flex flex-col items-center justify-center min-h-full' },
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {}
