import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.logout(true);
    this.router.navigate(['/']);
  }
}
