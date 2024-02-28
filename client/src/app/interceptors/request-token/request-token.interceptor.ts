import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from '@services/auth/auth.service';
import { Observable } from 'rxjs';
/** Pass untouched request through to the next request handler. */
@Injectable()
export class RequestTokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const modifiedRequest = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${this.authService.tokenGetter}`),
        });
        return next.handle(modifiedRequest);
    }
}
