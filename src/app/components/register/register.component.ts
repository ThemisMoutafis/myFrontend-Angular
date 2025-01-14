import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../shared/interfaces/spring-backend';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  userService = inject(UserService);
  router = inject(Router);
  registrationStatus: { success: boolean; message: string } = {
    success: false,
    message: 'Not attempted yet',
  };
  form = new FormGroup(
    {
      username: new FormControl('', Validators.required),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      birthdate: new FormControl('', Validators.required),
      countryName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\\d)(?=.*?[@#$!%&*]).{8,}$',
        ),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\\d)(?=.*?[@#$!%&*]).{8,}$',
        ),
      ]),
    },
    this.passwordConfirmPasswordValidator,
  );

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
  }


  checkOnSubmit() {

    const user: User = {
      username: this.form.get('username')?.value || '',
      firstname: this.form.get('firstname')?.value || '',
      lastname: this.form.get('lastname')?.value || '',
      email: this.form.get('email')?.value || '',
      password: this.form.get('password')?.value || '',
      birthdate: this.form.get('birthdate')?.value || '',
      countryName: this.form.get('countryName')?.value || '',
    };

    this.userService.registerUser(user).subscribe({
      next: (response) => {
        console.log('No Errors:', response);
        this.registrationStatus = {
          success: true,
          message: user.username + ' successfully created',
        };
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
        this.registrationStatus = { success: false, message: detailedMessage };
      },
    });
  }
}
