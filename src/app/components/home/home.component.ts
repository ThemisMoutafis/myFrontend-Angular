import { Component, inject } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router} from '@angular/router';
import { RouterLink } from '@angular/router';
import { ApiNewsFeedComponent } from "../api-news-feed/api-news-feed.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ApiNewsFeedComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  userService = inject(UserService);
  router = inject(Router);
  user = this.userService.user;
}
