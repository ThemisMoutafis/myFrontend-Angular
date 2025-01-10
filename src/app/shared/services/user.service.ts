import { inject, Injectable ,signal, effect} from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Credentials, LoggedInUser, User,ValidationErrorResponse } from '../interfaces/spring-backend';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
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
  
      check_duplicate_email(email:string) {
        return this.http.get<{msg: string}>(`${API_URL}/check_duplicate_email/${email}`)
      }
  
      loginUser(credentials: Credentials){
        return this.http.post<{ firstname: string;
            email: string;
            dateOfBirth: string;
            countryName: string;
            token: string;}>(`${API_URL}/api/auth/login`, credentials)
      }
  
      logoutUser(){
        this.user.set(null);
        localStorage.removeItem('access_token');
        this.router.navigate(['login']);
    }
  }
  