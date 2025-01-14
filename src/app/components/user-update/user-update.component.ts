import { Component, inject } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { UpdateUser } from '../../shared/interfaces/spring-backend';
import { RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css',
})
export class UserUpdateComponent {
  userService = inject(UserService);
  user = this.userService.user;

  updateStatus: { success: boolean; message: string } = {
    success: false,
    message: 'Not attempted yet',
  };

  form = new FormGroup(
    {
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      birthdate: new FormControl('', Validators.required),
      countryName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      oldPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\\d)(?=.*?[@#$!%&*]).{8,}$',
        ),
      ]),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\\d)(?=.*?[@#$!%&*]).{8,}$',
        ),
      ]),
      confirmPassword: new FormControl('', [
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\\d)(?=.*?[@#$!%&*]).{8,}$',
        ),
      ]),
    },
    this.passwordConfirmPasswordValidator,
  );

  ngOnInit() {
    // Access the signal's current value
    if (this.user) {
      console.log('on init works!' + this.user);
      this.form.patchValue({
        firstname: this.user()?.firstname,
        lastname: this.user()?.lastname,
        email: this.user()?.email,
        password: '', // empty for security
        confirmPassword: '', //  for security
        oldPassword: '',
        birthdate: this.user()?.dateOfBirth,
        countryName: this.user()?.countryName,
      });
    }
  }

  passwordConfirmPasswordValidator(
    control: AbstractControl,
  ): { [key: string]: boolean } | null {
    const form = control as FormGroup;
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password != confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(value: any) {
    console.log(value);
    this.checkOnSubmit();
    console.log('form submitted');
  }

  checkOnSubmit() {
    const email = this.form.get('email')?.value;
    const countryName = this.form.get('countryName')?.value; // Extract value from signal

    if (this.user) {
      const userUpdate: UpdateUser = {
        firstname: this.form.get('firstname')?.value || '',
        lastname: this.form.get('lastname')?.value || '',
        email: email || '',
        oldPassword: this.form.get('oldPassword')?.value || '',
        password: this.form.get('password')?.value || undefined,
        birthdate: this.form.get('birthdate')?.value || '',
        countryName: countryName || '',
      };

      console.log(userUpdate);

      if (this.user()?.username) {
        console.log('Username found:', this.user()?.username);
        this.userService
          .updateUser(this.user()?.username || ' ', userUpdate)
          .subscribe({
            next: (response) => {
              console.log('No Errors:', response);
              const usernameMessage = this.user()?.username || 'user';
              this.updateStatus = {
                success: true,
                message: `${usernameMessage} successfully updated`,
              };
              // Store the token in localStorage
              const access_token = response.token; // The 'token' field from the response
              localStorage.setItem('access_token', access_token);
              const decodedTokenSubject: {
                role: string;
                sub: string;
                firstname: string;
                lastname: string;
                email: string;
                dateOfBirth: string;
                countryName: string;
                username: string;
              } = jwtDecode(access_token);
              // .sub as unknown as LoggedInUser;
              console.log(decodedTokenSubject);
              // Set user details directly from the response
              this.userService.user.set({
                firstname: decodedTokenSubject.firstname,
                lastname: decodedTokenSubject.lastname,
                username: decodedTokenSubject.username,
                email: decodedTokenSubject.email,
                dateOfBirth: decodedTokenSubject.dateOfBirth,
                countryName: decodedTokenSubject.countryName,
                role: decodedTokenSubject.role, // Extracted from the JWT
                sub: decodedTokenSubject.sub, // Extracted from the JWT
                token: access_token, // Save the JWT token itself
              });
            },
            error: (errorResponse) => {
              console.log('Registration Error:', errorResponse);

              let detailedMessage = '';
              if (errorResponse.details) {
                errorResponse.details.forEach((detail: string) => {
                  console.error('Validation error:', detail);
                  detailedMessage += ` ${detail}`;
                });
              }
              if (!detailedMessage) {
                detailedMessage = errorResponse.message;
              }
              this.updateStatus = { success: false, message: detailedMessage };
            },
          });
      } else {
        console.log('Username is undefined or null');
      }
    } else {
      console.log('User is undefined or null');
    }
  }
}
