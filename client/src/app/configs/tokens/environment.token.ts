import { InjectionToken } from '@angular/core';
import { environment } from '@envs/environment.development';
import { ENV } from '@interfaces/environment/environment.interface';

export const ENVIRONMENT_SERVICE_CONFIG = new InjectionToken<ENV>('env-config');
export const ENVIRONMENT_CONFIG: ENV = environment;
