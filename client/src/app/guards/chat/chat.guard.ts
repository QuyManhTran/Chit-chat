import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { Observable, catchError, map } from 'rxjs';

export const chatGuard: CanActivateFn = (route, state) => {
    const userService: UserService = inject(UserService);
    const router: Router = inject(Router);
    if (userService.userGetter) return true;
    const init = userService.initUser();
    if (init === undefined) return router.createUrlTree(['/auth/login']);
    return init.pipe(
        catchError((err: HttpErrorResponse) => {
            return new Observable<undefined>((subcriber) => {
                subcriber.next(undefined);
                subcriber.complete();
            });
        }),
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
