import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
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
    
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
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
        Validators.minLength(4),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    },
    this.passwordConfirmPasswordValidator 
  );
  

  passwordConfirmPasswordValidator(control: AbstractControl): {[key:string]:boolean} |null {
    const form = control as FormGroup
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password!=confirmPassword){
      form.get("confirmPassword")?.setErrors({passwordMismatch: true})
      return {passwordMismatch : true }
    }
    return null
  }

  onSubmit(value: any) {
    console.log(value);
    this.checkOnSubmit();
  }

  registerAnother() {
    this.form.reset();
    this.registrationStatus.success = false;
    this.registrationStatus.message = 'Not attempted yet';
  }

  checkOnSubmit() {
    const email = this.form.get('email')?.value;
    const countryName = this.form.get('countryName')?.value;

    const user: User = {
      username: this.form.get('username')?.value || '',
      firstname: this.form.get('firstname')?.value || '',
      lastname: this.form.get('lastname')?.value || '',
      email: email || '',
      password: this.form.get('password')?.value || '',
      birthdate: this.form.get('birthdate')?.value || '',
      countryName: this.form.get('countryName')?.value || '',
    };
  
   
          this.userService.registerUser(user).subscribe({
            next: (response) => {
              console.log('No Errors:', response);
              this.registrationStatus = { success: true, message: user.username+ ' successfully created' };
            },
            error: (errorResponse) => {
              console.log('Registration Error:', errorResponse);

              let detailedMessage='';
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

