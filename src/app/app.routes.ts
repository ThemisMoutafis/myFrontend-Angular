import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';


export const routes: Routes = [
    {path:'', redirectTo:'/welcome',pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {path:'welcome',component:WelcomeComponent},
    {path:'register',component:RegisterComponent},
    {path:'welcome',component:NavbarComponent}
];
