import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';

export const routes: Routes = [
    {path:'', redirectTo:'/welcome',pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {path:'welcome',component:WelcomeComponent},
    {path:'register',component:RegisterComponent},
    {path:'welcome',component:NavbarComponent},
    {path:'home',component:HomeComponent,canActivate:[authGuard]},
    {path:'administration',component:AdministrationComponent,canActivate:[adminGuard]}
];
