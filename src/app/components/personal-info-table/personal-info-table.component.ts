import { Component,inject } from '@angular/core';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-personal-info-table',
  standalone: true,
  imports: [],
  templateUrl: './personal-info-table.component.html',
  styleUrl: './personal-info-table.component.css',
})
export class PersonalInfoTableComponent {
  userService = inject(UserService);
  user = this.userService.user;
}
