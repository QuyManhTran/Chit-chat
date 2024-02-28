import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';

import { Observable, map } from 'rxjs';
import { AuthService } from '@services/auth/auth.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class ResponseTokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const nextResponse = next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
                if (
                    event instanceof HttpResponse &&
                    event.body &&
                    event.body?.data &&
                    event.body?.accessToken
                ) {
                    this.authService.tokenSetter = event.body.accessToken;
                    const transformResponse = new HttpResponse({
                        body: event.body.data,
                        status: event.status,
                        statusText: event.statusText,
                        headers: event.headers,
                    });
                    return transformResponse;
                }
                if (event instanceof HttpResponse && event.body && event.body?.data) {
                    const transformResponse = new HttpResponse({
                        body: event.body.data,
                        status: event.status,
                        statusText: event.statusText,
                        headers: event.headers,
                    });
                    return transformResponse;
                }
                return event;
            })
        );
        return nextResponse;
    }
}
