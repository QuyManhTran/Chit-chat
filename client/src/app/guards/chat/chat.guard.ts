import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@services/user/user.service';

export const chatGuard: CanActivateFn = (route, state) => {
    const userService: UserService = inject(UserService);
    const router: Router = inject(Router);
    return userService.isLoggedGetter ? true : router.createUrlTree(['/auth/login']);
};
