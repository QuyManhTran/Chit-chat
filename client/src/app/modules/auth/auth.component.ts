import { Component, Inject, OnInit } from '@angular/core';
import { ENV } from '@interfaces/environment/environment.interface';
import { ENVIRONMENT_SERVICE_CONFIG } from 'src/app/configs/tokens/environment.token';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
    constructor(@Inject(ENVIRONMENT_SERVICE_CONFIG) private env_config: ENV) {}
    ngOnInit(): void {
        // console.log(this.env_config);
    }
}
