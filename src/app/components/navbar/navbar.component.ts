import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { inject } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  userService = inject(UserService);
  user = this.userService.user;

  logout() {
    this.userService.logoutUser()
  }
}
