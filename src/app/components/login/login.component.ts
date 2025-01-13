import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { Credentials } from '../../shared/interfaces/spring-backend';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LoggedInUser } from '../../shared/interfaces/spring-backend';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userService = inject(UserService);
  router = inject(Router);

  invalidLogin = false;
  loginError: string | null = null;
  form = new FormGroup ({

    username: new FormControl('',[Validators.required]),
    password: new FormControl('',Validators.required)
  })

  onSubmit() {
    const creds = this.form.value as Credentials;
    this.userService.loginUser(creds).subscribe({
      next: (response) => {
        // Assuming response contains the full user details and token
        const access_token = response.token;  // The 'token' field from the response
        console.log(access_token);
  
        // Store the token in localStorage
        localStorage.setItem('access_token', access_token);
        const decodedTokenSubject: { role: string, sub: string,firstname:string,lastname:string,email:string,dateOfBirth:string,countryName:string ,username:string} = jwtDecode(access_token)
          // .sub as unknown as LoggedInUser;
          console.log(decodedTokenSubject)
        // Set user details directly from the response
        this.userService.user.set({
          firstname: decodedTokenSubject.firstname,
          lastname:decodedTokenSubject.lastname,
          username:decodedTokenSubject.username,
          email: decodedTokenSubject.email,
          dateOfBirth: decodedTokenSubject.dateOfBirth,
          countryName: decodedTokenSubject.countryName,
          role: decodedTokenSubject.role,  // Extracted from the JWT
          sub: decodedTokenSubject.sub,    // Extracted from the JWT
          token: access_token,      // Save the JWT token itself
        })
        console.log('User Logged in:', this.userService.user());
        if(this.userService.user()?.role =='ADMIN')
        this.router.navigate(['administration'])
        else this.router.navigate(['home'])
  
      },
      error: (error)=> {
        console.log('Login Error:',error.message)
        this.invalidLogin = true;
        this.loginError = error.message;
      }
    })
  }
}
