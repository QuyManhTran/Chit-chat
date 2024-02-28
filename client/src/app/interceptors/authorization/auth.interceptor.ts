import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpStatusCode,
    HttpResponse,
} from '@angular/common/http';

import { Observable, catchError, of, throwError } from 'rxjs';
import { UserService } from '@services/user/user.service';
import { IErrorResponse } from '@interfaces/auth/response.interface';
import { AuthService } from '@services/auth/auth.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private userService: UserService, private authService: AuthService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const modifiedResponse = next.handle(req).pipe(
            catchError((httpErrorResponse: HttpErrorResponse) => {
                if (
                    httpErrorResponse.status === HttpStatusCode.Unauthorized ||
                    httpErrorResponse.status === HttpStatusCode.Forbidden
                ) {
                    /* handler auth remove all */
                    this.authService.tokenSetter = '';
                    this.userService.unAuthHandler();
                    return of(
                        new HttpResponse<IErrorResponse>({
                            body: { error: httpErrorResponse.message },
                        })
                    );
                }
                return throwError(httpErrorResponse);
            })
        );
        return modifiedResponse;
    }
}
