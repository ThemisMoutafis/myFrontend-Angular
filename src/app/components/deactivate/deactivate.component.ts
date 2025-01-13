import { Component,inject } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { RouterLink,Router } from '@angular/router';

@Component({
  selector: 'app-deactivate',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './deactivate.component.html',
  styleUrl: './deactivate.component.css'
})
export class DeactivateComponent {

  userService = inject(UserService);
  user = this.userService.user;
  router = inject(Router);

  cancel() {
    this.router.navigate(['/home']); // Redirect to the home or previous page if canceled
  }

  deactivateAccount(){
    if (this.userService.user()?.role == 'ADMIN') {
      window.alert('This is an admin account. You cannot deactivate an admin account from here.')
      return
    }
    const confirmation = window.confirm('This action cannot be undone!\n Are you sure you want to deactivate your account? This action will log you out and render you unable to use your account further.');
  
    if (confirmation) {
      this.userService.deactivateUser(this.userService.user()?.username || "").subscribe({
        next: () => {
          console.log(`User with username ${this.userService.user()?.username} deactivated succesfully`);
          this.userService.logoutUser();
      },
      error: (error) => {
        console.error(`Error activating user with ${this.userService.user()?.username}`, error);
      }
    }),
    console.log('Account Deactivated!')
    }else { console.log('Delete action was cancelled');
    }
  }
}

