import * as Raven from 'raven-js';
import { ErrorHandler } from '@angular/core';
import { environment } from '../../../environments/environment';

Raven.config(environment.sentryKey).install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err);
    // const eventId = Raven.captureException(err);
    //Raven.showReportDialog(eventId);
  }
}
