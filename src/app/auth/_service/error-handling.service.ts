import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  public countErrorMessage = 0;

  constructor() {}

  public checkError(error) {
    this.countErrorMessage++;

    if (environment.errorMessage !== 'empty' && this.countErrorMessage === 1) {
      console.log('HTTP Error Status Code: ', environment.errorMessage);
      if (error.status === 0) {
        console.log('Service is not connected ; Error Status Code : ', error.status);
        // alert("Connection Refused");
      }

      if (error.status === 400) {
        console.log('Service is not connected ; Error Status Code : ', error.status);
        alert('Select Provider to proceed further');
      }

      if (error.status >= 500 && error.status < 511) {
        console.log('A Server Error Occured ; Error Status Code : ', error.status);
        alert('A Server Error Occured');
        if (error.error.exception === 'com.mongodb.MongoTimeoutException') {
          console.log('Denial Diagonstics Summary Mongo Db Exception ', error.error.exception);
          alert('Mongo Db is NOT connected');
        }
      }
      if (error.status === 440) {
        console.log("The client's session has expired and must log in again ; Error Status Code : ", error.status);
        alert('Login Session Expired' + environment.errorMessage);
      }
      if (error.status > 400 && error.status < 500 && error.status !== 440) {
        console.log('Request could not be understood by the server; Error Status Code : ', error.status);
        alert('Request could not be understood by the server');
      }
    }
  }
}
