import { Component,inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { ReadUser } from '../../shared/interfaces/spring-backend';
import { PaginatedResult } from '../../shared/interfaces/spring-backend';
@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css'
})
export class AdministrationComponent {
userService = inject(UserService);
  user = this.userService.user;

  users: ReadUser[] = [];
  
  currentPage: number = 0; // Track the current page
  totalPages: number = 0; // Track the total number of pages
  pageSize: number = 5; // Set the number of users per page

  getUsers() {
    this.userService.getAllUsersPaginated(this.currentPage, this.pageSize).subscribe({
      next: (response:PaginatedResult<ReadUser>) => {
        this.users = response.users;
        this.totalPages = response.totalPages;
        console.log('Users:', this.users); // Users will have proper typing
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }
     // Navigate to the previous page
  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getUsers();
    }
  }

  // Navigate to the next page
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getUsers();
    }
  }

  activateUser(username:string){
    this.userService.activateUser(username).subscribe({
      next: () => {
        console.log(`User with username ${username} activated succesfully`); // Users will have proper typing
        this.getUsers();
    },
    error: (error) => {
      console.error(`Error activating user with username ${username}`, error);
    }
  });
  }

  deactivateUser(username:string){
    this.userService.deactivateUser(username).subscribe({
      next: () => {
        console.log(`User with username ${username} activated succesfully`); // Users will have proper typing
        this.getUsers();
    },
    error: (error) => {
      console.error(`Error activating user with ${username}`, error);
    }
  });
  }

  deleteUser(id:number){
    const confirmation = window.confirm('Are you sure you want to delete this user?');
  
    if (confirmation) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          console.log(`User with id: ${id} deleted successfully`);
          this.getUsers();
        },
        error: (error) => {
          console.error(`Error deleting user with ${id}`, error);
        }
      });
    } else {
      console.log('Delete action was cancelled');
    }
  }
}
