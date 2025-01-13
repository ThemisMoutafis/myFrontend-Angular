import { Component ,inject} from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router, RouterLinkActive } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MenuEntry } from '../../shared/interfaces/menu-entry';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
userService = inject(UserService);
router = inject(Router);
user = this.userService.user

}
