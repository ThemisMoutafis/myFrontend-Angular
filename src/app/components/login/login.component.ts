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
        const decodedTokenSubject: { role: string, sub: string } = jwtDecode(access_token)
          // .sub as unknown as LoggedInUser;
          console.log(decodedTokenSubject)
        // Set user details directly from the response
        this.userService.user.set({
          firstname: response.firstname,
          email: response.email,
          dateOfBirth: response.dateOfBirth,
          countryName: response.countryName,
          role: decodedTokenSubject.role,  // Extracted from the JWT
          sub: decodedTokenSubject.sub,    // Extracted from the JWT
          token: access_token,      // Save the JWT token itself
        })
        console.log('User Logged in:', this.userService.user());
        this.router.navigate(['welcome'])
  
      },
      error: (error)=> {
        console.log('Login Error',error)
        this.invalidLogin = true;
      }
    })
  }
}
