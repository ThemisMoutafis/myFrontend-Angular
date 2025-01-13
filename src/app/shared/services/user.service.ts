import { inject, Injectable ,signal, effect} from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Credentials, LoggedInUser, ReadUser, User,ValidationErrorResponse,PaginatedResponse,PaginatedResult } from '../interfaces/spring-backend';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';

const API_URL = `${environment.apiURL}`

@Injectable({
    providedIn: 'root'
  })
  export class UserService {
      http: HttpClient = inject(HttpClient)
      router = inject(Router);
  
      user = signal<LoggedInUser | null>(null)
  
      constructor() {
        const access_token = localStorage.getItem("access_token");
        if (access_token) {
          const decodedTokenSubject = jwtDecode<LoggedInUser>(access_token);
          console.log("Decoded token:", decodedTokenSubject);  // Log the decoded token
    
          this.user.set({
            sub:decodedTokenSubject.sub,
            username: decodedTokenSubject.username,
            firstname: decodedTokenSubject.firstname,
            email: decodedTokenSubject.email,
            dateOfBirth: decodedTokenSubject.dateOfBirth,
            countryName: decodedTokenSubject.countryName,
            token: access_token,
            role: decodedTokenSubject.role
          });
        }
    
        effect(() => {
          const user = this.user();
          console.log("User state:", user);  // Check if user is set correctly
          if (user) {
            console.log("User Logged in:", user.username);
          } else {
            console.log("No user logged in");
          }
        });
      }
  
      registerUser(user: User) {
        return this.http.post<{msg: string}>(`${API_URL}/api/users/save`, user).pipe(
          catchError((error: HttpErrorResponse) => {
              const errorResponse: ValidationErrorResponse = error.error;
              return throwError(() => errorResponse);
          })
      );
      }
  
      getAllUsersPaginated(page: number = 0, size: number = 5): Observable<PaginatedResult<ReadUser>>{
        return this.http.get<PaginatedResponse<ReadUser>>(`${API_URL}/api/users?page=${page}&size=${size}`)
        .pipe(map(response =>({users: response.content,totalPages:response.totalPages})));
      }
  
      loginUser(credentials: Credentials){
        return this.http.post<{token: string;}>(`${API_URL}/api/auth/login`, credentials).pipe(
          catchError((error: HttpErrorResponse) => {
              const errorResponse: ValidationErrorResponse = error.error;
              return throwError(() => errorResponse);
          })
        );
      }
      
      activateUser(username:string):Observable<void>{
        return this.http.put<void>(`${API_URL}/api/user/${username}/activate`, {}).pipe(
          tap(() => {
            console.log('User activated successfully');
          })
        );
      }

      deactivateUser(username:string):Observable<void>{
        return this.http.put<void>(`${API_URL}/api/user/${username}/deactivate`, {}).pipe(
          tap(() => {
            console.log('User deactivated successfully');
          })
        );
      }

      deleteUser(id:number):Observable<void>{
        return this.http.delete<void>(`${API_URL}/api/user/${id}/delete`, {}).pipe(
          tap(() => {
            console.log('User deleted successfully');
          })
        );
      }

      logoutUser(){
        this.user.set(null);
        localStorage.removeItem('access_token');
        this.router.navigate(['login']);
    }
  }
  