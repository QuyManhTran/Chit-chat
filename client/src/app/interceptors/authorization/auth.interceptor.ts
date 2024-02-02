import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpStatusCode,
} from '@angular/common/http';

import { Observable, catchError } from 'rxjs';
import { UserService } from '@services/user/user.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private userService: UserService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const modifiedResponse = next.handle(req).pipe(
            catchError((httpErrorResponse: HttpErrorResponse) => {
                if (
                    httpErrorResponse.status === HttpStatusCode.Unauthorized ||
                    httpErrorResponse.status === HttpStatusCode.Forbidden
                ) {
                    /* handler auth remove all */
                    this.userService.unAuthHandler();
                }
                return [];
            })
        );
        return modifiedResponse;
    }
}
