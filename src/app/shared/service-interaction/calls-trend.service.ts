import { Injectable } from '@angular/core';
import { CallsService } from '../../rest/service-interaction/calls.service';
import { ServiceInteractionModule } from '../../components/service-interaction/service-interaction.module';
import { SessionService } from '../session.service';
import { CommonUtilsService } from '../common-utils.service';

@Injectable()
export class CallsTrendService {
  private previousTrend: String = 'PreviousLast30Days';
  private lastTrend: String = 'Last30Days';
  private providerKey: number;

  constructor(
    private callsService: CallsService,
    private session: SessionService,
    private common: CommonUtilsService
  ) {}

  public getCallsTrendData() {
    this.providerKey = this.session.providerKeyData();

    return new Promise(resolve => {
      let parameters;
      parameters = [this.providerKey, this.previousTrend, this.lastTrend];
      const tempArray: Array<object> = [];

      this.callsService.getCallsTrendData(...parameters).subscribe(
        ([previousLast, lastTrend]) => {
          let sdataQuestionType: object = {};
          let sdataTalkTime: object = {};

          if (
            lastTrend != null &&
            previousLast != null &&
            typeof lastTrend === 'object' &&
            typeof previousLast === 'object'
          ) {
            sdataQuestionType = this.common.trendNegativeMeansGood(
              lastTrend.CallVolByQuesType.Total,
              previousLast.CallVolByQuesType.Total
            );
            sdataTalkTime = this.common.trendNegativeMeansGood(
              lastTrend.CallTalkTimeByQuesType.Total,
              previousLast.CallTalkTimeByQuesType.Total
            );
          } else {
            sdataQuestionType = null;
            sdataTalkTime = null;
          }
          tempArray.push(sdataQuestionType, sdataTalkTime);
          resolve(tempArray);
        },
        err => {
          console.log('Calls Trend Error Data', err);
        }
      );
    });
  }
}
