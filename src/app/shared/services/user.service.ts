import { inject, Injectable ,signal, effect} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Credentials, LoggedInUser, User } from '../interfaces/spring-backend';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

const API_URL = `${environment.apiURL}/api/auth`

@Injectable({
    providedIn: 'root'
  })
  export class UserService {
      http: HttpClient = inject(HttpClient)
      router = inject(Router);
  
      user = signal<LoggedInUser | null>(null)
  
      constructor() {
        const access_token = localStorage.getItem("access_token")
        
  
        effect(() =>{
          if (this.user()){
            console.log("User Logged in", this.user()?.sub)
          } else {
            console.log("No user logged in")
          }
        })
      }
  
      registerUser(user: User) {
        return this.http.post<{msg:string}>(`${API_URL}/register`,user)
      }
  
      check_duplicate_email(email:string) {
        return this.http.get<{msg: string}>(`${API_URL}/check_duplicate_email/${email}`)
      }
  
      loginUser(credentials: Credentials){
        return this.http.post<{ firstname: string;
            email: string;
            dateOfBirth: string;
            countryName: string;
            token: string;}>(`${API_URL}/login`, credentials)
      }
  
      logoutUser(){
        this.user.set(null);
        localStorage.removeItem('access_token');
        this.router.navigate(['login']);
    }
  }
  