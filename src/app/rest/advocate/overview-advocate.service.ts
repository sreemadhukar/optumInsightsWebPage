/* @author gmounika */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { IPaymentBySubResponse } from '../../modals/i-payment-by-submission';
import { get as _get } from 'lodash';
import { OverviewAdvocate } from './../../modals/title-config';
@Injectable({
  providedIn: 'root'
})
export class OverviewAdvocateService {
  public combined: any;
  private APP_URL: string = environment.apiProxyUrl;
  // private APPEALS_SERVICE_PATH: string = environment.apiUrls.Appeals;
  private APPEALS_TREND_SERVICE_PATH: string = environment.apiUrls.AppealsTrend;
  private CALLS_TREND_LINE_SERVICE_PATH: string = environment.apiUrls.CallsTrendLine;
  private CALLS_TREND_SERVICE_PATH: string = environment.apiUrls.CallsTrend;
  private PAYMENTS_BY_SUBMISSION_SERVICE_PATH: string = environment.apiUrls.PaymentsBySubmission;
  private readonly PAYMENTS_BY_SUBMISSION_DOP_SERVICE_PATH: string = environment.apiUrls.PaymentsBySubmissionDOP;
  private readonly APPEALS_SERVICE: string = environment.apiUrls.AppealsFHIR; // new

  constructor(private http: HttpClient) {}

  public appealsData(...parameters) {
    const appealsParams = parameters[1];
    // if (appealsParams.FundingTypeCodes) {
    //   delete appealsParams.FundingTypeCodes;
    // }
    let appealsReqType = '';
    if (parameters[1].appealsProcessing === 'Received Date') {
      appealsReqType = '?request-type=APPEALS_MEASURE_DOR_HCO';
    } else {
      appealsReqType = '?request-type=APPEALS_MEASURE_DOC_HCO';
    }
    const appealsURL = this.APP_URL + this.APPEALS_SERVICE + parameters[0] + appealsReqType;
    return this.http.post(appealsURL, appealsParams).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public appealsDataTrendByMonth(...parameters) {
    const appealsParams = parameters[1];
    if (!appealsParams.Tin) {
      appealsParams.AllProviderTins = true;
    }
    const appealsURL = this.APP_URL + this.APPEALS_TREND_SERVICE_PATH + parameters[0];
    return this.http.post(appealsURL, appealsParams).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public callsData(...parameters) {
    const callsParams = parameters[1];
    if (!callsParams.Tin) {
      callsParams.AllProviderTins = true;
    }

    let params = new HttpParams();

    if (parameters[1].TimeFilter === 'CalendarYear') {
      params = params.append(OverviewAdvocate.timeFilter, parameters[1].TimeFilter);
      params = params.append('time-filter-text', parameters[1].TimeFilterText);
    } else {
      params = params.append(OverviewAdvocate.timeFilter, parameters[1].TimeFilter);
    }

    const callsURL = this.APP_URL + this.CALLS_TREND_SERVICE_PATH + parameters[0];

    return this.http.get(callsURL, { params }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => {
        throw err;
      })
    );
  }

  public callsTrendLineData(...parameters) {
    const callsParams = parameters[1];
    if (!callsParams.Tin) {
      callsParams.AllProviderTins = true;
    }

    let params = new HttpParams();
    if (parameters[1].TimeFilter === 'CalendarYear') {
      params = params.append(OverviewAdvocate.timeFilter, parameters[1].TimeFilter);
      params = params.append('time-filter-text', parameters[1].TimeFilterText);
    } else {
      params = params.append(OverviewAdvocate.timeFilter, parameters[1].TimeFilter);
    }

    const callsURL = this.APP_URL + this.CALLS_TREND_LINE_SERVICE_PATH + parameters[0];

    return this.http.get(callsURL, { params }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => {
        throw err;
      })
    );
  }

  public paymentsBySubmission(...parameters): Observable<IPaymentBySubResponse> {
    const claimsBY = _get(parameters[1], ['ClaimsBy']);
    let nonPaymentURL =
      this.APP_URL + this.PAYMENTS_BY_SUBMISSION_SERVICE_PATH + parameters[0] + '?request-type=PAYMENT_METRICS';

    // Create URL for DOP Submission
    if (claimsBY === 'DOP') {
      nonPaymentURL =
        this.APP_URL + this.PAYMENTS_BY_SUBMISSION_DOP_SERVICE_PATH + parameters[0] + '?request-type=CLAIMS';
    }

    return this.http.post<IPaymentBySubResponse>(nonPaymentURL, parameters[1]).pipe(
      map((res: any) => {
        // Handle response for DOP submissions
        if (claimsBY === 'DOP') {
          return _get(res, ['Data', '0'], {});
        }
        if (res.Data == null) {
          return null;
        } else {
          return res.Data;
        }
      }),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
