import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { map } from 'rxjs';

export const chatGuard: CanActivateFn = (route, state) => {
    const userService: UserService = inject(UserService);
    const router: Router = inject(Router);
    if (userService.userGetter) return true;
    const init = userService.initUser();
    if (init === undefined) return router.createUrlTree(['/auth/login']);
    return init.pipe(
        map((value) => {
            if (value) {
                console.log(value);
                userService.userSetter = value;
                userService.isLoggedSetter = true;
                return true;
            }
            return router.createUrlTree(['/auth/login']);
        })
    );
};
