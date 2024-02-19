import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@services/user/user.service';

export const authGuard: CanActivateFn = (route, state) => {
    const userService: UserService = inject(UserService);
    const router: Router = inject(Router);
    return !userService.isLogged ? true : router.navigate(['/chat']);
};
