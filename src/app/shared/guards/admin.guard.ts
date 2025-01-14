import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const user = userService.user();
  if (user?.role == 'ADMIN') {
    return true;
  }

  if (user) {
    return router.navigate(['home']);
  }

  return router.navigate(['login']);
};
