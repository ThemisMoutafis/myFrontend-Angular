import { Component ,inject} from '@angular/core';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent {
  userService = inject(UserService);
  user = this.userService.user;
}
