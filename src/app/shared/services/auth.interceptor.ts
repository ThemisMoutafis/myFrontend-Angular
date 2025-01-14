import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from './user.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private jwtHelper: JwtHelperService;
  userService = inject(UserService);
  user = this.userService.user;

  constructor() {
    // Lazily instantiate JwtHelperService to avoid circular dependency with HttpRequest. Not sure why this happens, but this way it works.
    this.jwtHelper = new JwtHelperService();
  }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = localStorage.getItem('access_token');
    if (!authToken) {
      return next.handle(req);
    }

    if (this.jwtHelper.isTokenExpired(authToken)) {
      console.warn('Token is expired, not attaching to the request.');
      this.userService.logoutUser();
      return next.handle(req);
    }

    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken),
    });

    return next.handle(authRequest);
  }
}
