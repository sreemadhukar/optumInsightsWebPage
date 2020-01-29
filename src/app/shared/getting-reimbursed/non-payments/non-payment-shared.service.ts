import { Injectable } from '@angular/core';
import { GettingReimbursedModule } from '../../../components/getting-reimbursed-page/getting-reimbursed.module';
import { NonPaymentService } from './../../../rest/getting-reimbursed/non-payment.service';
import { CommonUtilsService } from '../../common-utils.service';
import { SessionService } from '../../session.service';
import { AuthorizationService } from '../../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../../glossary-metricid.service';
import { AdvocateModule } from '../../../components/advocate/advocate.module';
import { HttpParams } from '@angular/common/http';
import { GettingReimbursedPayload } from '../payload.class';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { tmpdir } from 'os';

@Injectable({
  providedIn: 'root'
})
export class NonPaymentSharedService {
  public providerKey;
  public summaryData: Array<object> = [];
  public timeFrame: string;
  private tin: string;
  private lob: string;
  private nonPaymentBy: string;
  private categoriesFetchCount = 7;
  private subCategoriesFetchCount = 7;

  constructor(
    private MetricidService: GlossaryMetricidService,
    private nonPaymentService: NonPaymentService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService
  ) {}

  // The getNonPayment() function fetches data for Claims Not Paid and Claims Non-Payment Rate
  public getNonPayment(param) {
    /*
    let lobValueParam;
    if (param.lineOfBusiness) {
      lobValueParam = _.startCase(param.lineOfBusiness.toLowerCase());
    } else {
      lobValueParam = 'All';
    }
    delete param['lineOfBusiness'];
    */
    this.providerKey = this.session.providerKeyData();
    if (param.viewClaimsByFilter === 'DateOfProcessing') {
      return new Promise(resolve => {
        this.nonPaymentService.getNonPaymentData(...this.getParameterCategories(param)).subscribe(
          nonPaymentData1 => {
            let claimsNotPaid;
            let claimsNotPaidRate;
            const lobValue = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'ALL';
            if (
              (nonPaymentData1 || {}).LineOfBusiness &&
              nonPaymentData1.LineOfBusiness.ALL.hasOwnProperty('ClaimFinancialMetrics') &&
              nonPaymentData1.LineOfBusiness.ALL.ClaimFinancialMetrics.hasOwnProperty('DeniedAmount')
            ) {
              const nonPaidData = [];
              if (
                nonPaymentData1.LineOfBusiness.hasOwnProperty('MedicareAndRetirement') &&
                nonPaymentData1.LineOfBusiness.MedicareAndRetirement != null
              ) {
                if (
                  nonPaymentData1.LineOfBusiness.MedicareAndRetirement.hasOwnProperty('ClaimFinancialMetrics') &&
                  nonPaymentData1.LineOfBusiness.MedicareAndRetirement.ClaimFinancialMetrics &&
                  nonPaymentData1.LineOfBusiness.MedicareAndRetirement.ClaimFinancialMetrics.hasOwnProperty(
                    'DeniedAmount'
                  ) &&
                  (lobValue === 'ALL' || lobValue === 'MedicareAndRetirement')
                ) {
                  nonPaidData.push(
                    nonPaymentData1.LineOfBusiness.MedicareAndRetirement.ClaimFinancialMetrics.DeniedAmount
                  );
                }
              }
              if (
                nonPaymentData1.LineOfBusiness.hasOwnProperty('CommunityAndState') &&
                nonPaymentData1.LineOfBusiness.CommunityAndState != null
              ) {
                if (
                  nonPaymentData1.LineOfBusiness.CommunityAndState.hasOwnProperty('ClaimFinancialMetrics') &&
                  nonPaymentData1.LineOfBusiness.CommunityAndState.ClaimFinancialMetrics &&
                  nonPaymentData1.LineOfBusiness.CommunityAndState.ClaimFinancialMetrics.hasOwnProperty(
                    'DeniedAmount'
                  ) &&
                  (lobValue === 'ALL' || lobValue === 'CommunityAndState')
                ) {
                  nonPaidData.push(nonPaymentData1.LineOfBusiness.CommunityAndState.ClaimFinancialMetrics.DeniedAmount);
                }
              }
              if (
                nonPaymentData1.LineOfBusiness.hasOwnProperty('EmployerAndIndividual') &&
                nonPaymentData1.LineOfBusiness.EmployerAndIndividual != null
              ) {
                if (
                  nonPaymentData1.LineOfBusiness.EmployerAndIndividual.hasOwnProperty('ClaimFinancialMetrics') &&
                  nonPaymentData1.LineOfBusiness.EmployerAndIndividual.ClaimFinancialMetrics &&
                  nonPaymentData1.LineOfBusiness.EmployerAndIndividual.ClaimFinancialMetrics.hasOwnProperty(
                    'DeniedAmount'
                  ) &&
                  (lobValue === 'ALL' || lobValue === 'EmployerAndIndividual')
                ) {
                  nonPaidData.push(nonPaymentData1.LineOfBusiness.CommunityAndState.ClaimFinancialMetrics.DeniedAmount);
                }
              }
              if (
                nonPaymentData1.LineOfBusiness.hasOwnProperty('UNKNOWN') &&
                nonPaymentData1.LineOfBusiness.UNKNOWN != null
              ) {
                if (
                  nonPaymentData1.LineOfBusiness.UNKNOWN.hasOwnProperty('ClaimFinancialMetrics') &&
                  nonPaymentData1.LineOfBusiness.UNKNOWN.ClaimFinancialMetrics &&
                  nonPaymentData1.LineOfBusiness.UNKNOWN.ClaimFinancialMetrics.hasOwnProperty('DeniedAmount') &&
                  (lobValue === 'ALL' || lobValue === 'UNKNOWN')
                ) {
                  nonPaidData.push(nonPaymentData1.LineOfBusiness.UNKNOWN.ClaimFinancialMetrics.DeniedAmount);
                }
              }
              if (lobValue !== 'ALL') {
                const amountPaid = nonPaymentData1.LineOfBusiness.ALL.ClaimFinancialMetrics.DeniedAmount;
                const amountPaidLOB = nonPaymentData1.LineOfBusiness[lobValue].ClaimFinancialMetrics.DeniedAmount;
                nonPaidData.push(amountPaid - amountPaidLOB);
              }
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Not Paid',
                MetricID: this.MetricidService.MetricIDs.ClaimsNotPaid,
                data: {
                  graphValues: nonPaidData,
                  centerNumber:
                    this.common.nFormatter(
                      nonPaymentData1.LineOfBusiness[lobValue].ClaimFinancialMetrics.DeniedAmount
                    ) < 1 &&
                    this.common.nFormatter(
                      nonPaymentData1.LineOfBusiness[lobValue].ClaimFinancialMetrics.DeniedAmount
                    ) > 0
                      ? '< $1'
                      : '$' +
                        this.common.nFormatter(
                          nonPaymentData1.LineOfBusiness[lobValue].ClaimFinancialMetrics.DeniedAmount
                        ),
                  color: this.common.returnLobColor(nonPaymentData1.LineOfBusiness, lobValue),
                  gdata: ['card-inner', 'claimsNotPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: this.common.returnHoverLabels(nonPaymentData1.LineOfBusiness, lobValue),
                  hover: true
                },
                besideData: {
                  labels: this.common.lobNameForSideLabels(lobValue, nonPaymentData1.LineOfBusiness),
                  color: this.common.lobColorForLabels(lobValue, nonPaymentData1.LineOfBusiness)
                },
                timeperiod:
                  this.common.dateFormat(nonPaymentData1.StartDate) +
                  '&ndash;' +
                  this.common.dateFormat(nonPaymentData1.EndDate)
              };
            } else {
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                status: 404,
                title: 'Claims Not Paid',
                MetricID: this.MetricidService.MetricIDs.ClaimsNotPaid,
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            }
            if (
              (nonPaymentData1 || {}).LineOfBusiness &&
              nonPaymentData1.LineOfBusiness.ALL.hasOwnProperty('ClaimFinancialMetrics') &&
              nonPaymentData1.LineOfBusiness.ALL.ClaimFinancialMetrics.hasOwnProperty('ClaimsYieldRate') &&
              nonPaymentData1.LineOfBusiness.ALL.ClaimFinancialMetrics.hasOwnProperty('ClaimsNonPaymentRate')
            ) {
              claimsNotPaidRate = {
                category: 'app-card',
                type: 'donut',
                title: 'Claims Non-Payment Rate',
                MetricID: this.MetricidService.MetricIDs.ClaimsNonPaymentRate,
                toggle: true,
                data: {
                  graphValues: [
                    nonPaymentData1.LineOfBusiness.ALL.ClaimFinancialMetrics.ClaimsNonPaymentRate,
                    nonPaymentData1.LineOfBusiness.ALL.ClaimFinancialMetrics.ClaimsYieldRate
                  ],
                  centerNumber:
                    nonPaymentData1.LineOfBusiness.ALL.ClaimFinancialMetrics.ClaimsNonPaymentRate < 1 &&
                    nonPaymentData1.LineOfBusiness.ALL.ClaimFinancialMetrics.ClaimsNonPaymentRate > 0
                      ? '< 1%'
                      : nonPaymentData1.LineOfBusiness.ALL.ClaimFinancialMetrics.ClaimsNonPaymentRate + '%',
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'claimsNonPaymentRate'],
                  sdata: null
                },
                timeperiod:
                  this.common.dateFormat(nonPaymentData1.LineOfBusiness.StartDate) +
                  '&ndash;' +
                  this.common.dateFormat(nonPaymentData1.LineOfBusiness.EndDate)
              };
            } else {
              claimsNotPaidRate = {
                category: 'app-card',
                type: 'donut',
                status: 404,
                title: 'Claims Non-Payment Rate',
                MetricID: this.MetricidService.MetricIDs.ClaimsNonPaymentRate,
                data: null,
                toggle: true,
                timeperiod: null
              };
            }
            this.summaryData = [];
            this.summaryData.push(claimsNotPaid, claimsNotPaidRate);
            resolve(this.summaryData);
          },
          err => {
            console.log('Non Payment Page , Error for two donuts Data', err);
          }
        );
      });
    } else {
      return new Promise(resolve => {
        this.nonPaymentService.getNonPaymentData(...this.getParameterCategories(param)).subscribe(
          ([nonPaymentData1]) => {
            let claimsNotPaid;
            let claimsNotPaidRate;
            // const lobValue = lobValueParam;
            const lobValue = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'All';
            if (
              (nonPaymentData1 || {}).All &&
              nonPaymentData1.All.hasOwnProperty('ClaimsLobSummary') &&
              nonPaymentData1.All.ClaimsLobSummary.length &&
              nonPaymentData1.All.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
            ) {
              const nonPaidData = [];
              if (nonPaymentData1.hasOwnProperty('Mr') && nonPaymentData1.Mr != null) {
                if (
                  nonPaymentData1.Mr.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Mr.ClaimsLobSummary.length &&
                  nonPaymentData1.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountDenied') &&
                  (lobValue === 'All' || lobValue === 'Mr')
                ) {
                  nonPaidData.push(nonPaymentData1.Mr.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Cs') && nonPaymentData1.Cs != null) {
                if (
                  nonPaymentData1.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Cs.ClaimsLobSummary.length &&
                  nonPaymentData1.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountDenied') &&
                  (lobValue === 'All' || lobValue === 'Cs')
                ) {
                  nonPaidData.push(nonPaymentData1.Cs.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Ei') && nonPaymentData1.Ei != null) {
                if (
                  nonPaymentData1.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Ei.ClaimsLobSummary.length &&
                  nonPaymentData1.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountDenied') &&
                  (lobValue === 'All' || lobValue === 'Ei')
                ) {
                  nonPaidData.push(nonPaymentData1.Ei.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Un') && nonPaymentData1.Un != null) {
                if (
                  nonPaymentData1.Un.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Un.ClaimsLobSummary.length &&
                  nonPaymentData1.Un.ClaimsLobSummary[0].hasOwnProperty('AmountDenied') &&
                  (lobValue === 'All' || lobValue === 'Un')
                ) {
                  nonPaidData.push(nonPaymentData1.Un.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (lobValue !== 'All') {
                const amountPaid = nonPaymentData1.All.ClaimsLobSummary[0].AmountDenied;
                const amountPaidLOB = nonPaymentData1[lobValue].ClaimsLobSummary[0].AmountDenied;
                nonPaidData.push(amountPaid - amountPaidLOB);
              }
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Not Paid',
                MetricID: this.MetricidService.MetricIDs.ClaimsNotPaid,
                data: {
                  graphValues: nonPaidData,
                  centerNumber:
                    this.common.nFormatter(nonPaymentData1[lobValue].ClaimsLobSummary[0].AmountDenied) < 1 &&
                    this.common.nFormatter(nonPaymentData1[lobValue].ClaimsLobSummary[0].AmountDenied) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(nonPaymentData1[lobValue].ClaimsLobSummary[0].AmountDenied),
                  color: this.common.returnLobColor(nonPaymentData1, lobValue),
                  gdata: ['card-inner', 'claimsNotPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: this.common.returnHoverLabels(nonPaymentData1, lobValue),
                  hover: true
                },
                besideData: {
                  labels: this.common.lobNameForSideLabels(lobValue, nonPaymentData1),
                  color: this.common.lobColorForLabels(lobValue, nonPaymentData1)
                },
                timeperiod:
                  this.common.dateFormat(nonPaymentData1.Startdate) +
                  '&ndash;' +
                  this.common.dateFormat(nonPaymentData1.Enddate)
              };
            } else {
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                status: 404,
                title: 'Claims Not Paid',
                MetricID: this.MetricidService.MetricIDs.ClaimsNotPaid,
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            }
            if (
              (nonPaymentData1 || {}).All &&
              nonPaymentData1.All.hasOwnProperty('ClaimsLobSummary') &&
              nonPaymentData1.All.ClaimsLobSummary.length &&
              nonPaymentData1.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate') &&
              nonPaymentData1.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsNonPaymentRate')
            ) {
              claimsNotPaidRate = {
                category: 'app-card',
                type: 'donut',
                title: 'Claims Non-Payment Rate',
                MetricID: this.MetricidService.MetricIDs.ClaimsNonPaymentRate,
                toggle: true,
                data: {
                  graphValues: [
                    nonPaymentData1.All.ClaimsLobSummary[0].ClaimsNonPaymentRate,
                    nonPaymentData1.All.ClaimsLobSummary[0].ClaimsYieldRate
                  ],
                  centerNumber:
                    nonPaymentData1.All.ClaimsLobSummary[0].ClaimsNonPaymentRate < 1 &&
                    nonPaymentData1.All.ClaimsLobSummary[0].ClaimsNonPaymentRate > 0
                      ? '< 1%'
                      : nonPaymentData1.All.ClaimsLobSummary[0].ClaimsNonPaymentRate + '%',
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'claimsNonPaymentRate'],
                  sdata: null
                },
                timeperiod:
                  this.common.dateFormat(nonPaymentData1.Startdate) +
                  '&ndash;' +
                  this.common.dateFormat(nonPaymentData1.Enddate)
              };
            } else {
              claimsNotPaidRate = {
                category: 'app-card',
                type: 'donut',
                status: 404,
                title: 'Claims Non-Payment Rate',
                MetricID: this.MetricidService.MetricIDs.ClaimsNonPaymentRate,
                data: null,
                toggle: true,
                timeperiod: null
              };
            } // end if else
            this.summaryData = [];
            /** REMOVE LATER (ONCE PDP ISSUE SOLVED) ***/
            // claimsNotPaidRate = {
            //   category: 'app-card',
            //   type: 'donut',
            //   title: null,
            //   data: null,
            //   timeperiod: null
            // };
            this.summaryData.push(claimsNotPaid, claimsNotPaidRate);
            resolve(this.summaryData);
          },
          err => {
            console.log('Non Payment Page , Error for two donuts Data', err);
          }
        );
      });
    }
  } // end funtion getNonPayment()

  getParameterCategories(param) {
    let parameters = [];
    this.providerKey = this.session.providerKeyData();
    parameters = [this.providerKey, new GettingReimbursedPayload(param)];
    return parameters;
  } // end getParameterCategories() function for Top Reasons Categories

  public getNonPaymentCategories(param) {
    // Assign the paramater variable
    let paramtersCategories = [];
    paramtersCategories = this.getParameterCategories(param);
    paramtersCategories[1]['Count'] = this.categoriesFetchCount;
    this.getParameterCategories(param);
    return new Promise(resolve => {
      this.sharedTopCategories(paramtersCategories)
        .then(topReasons => {
          try {
            const p = JSON.parse(JSON.stringify(topReasons));
            // Values descending here
            if (p === null || p.length <= 0) {
              return null;
            }
            const subCategoryReasons: any = [];
            if (param.viewClaimsByFilter === 'DateOfProcessing') {
              for (let i = 0; i < p.length; i++) {
                let x = JSON.parse(JSON.stringify(paramtersCategories)); // deep copy
                x[1]['DenialCategory'] = p[i]['title'];
                x[1]['Count'] = this.subCategoriesFetchCount;
                x[1]['ReportType'] = 'subject';
                subCategoryReasons.push(x);
                x = [];
              }
            } else {
              for (let i = 0; i < p.length; i++) {
                let x = JSON.parse(JSON.stringify(paramtersCategories)); // deep copy
                x[1]['denialCategory'] = p[i]['title'];
                x[1]['Count'] = this.subCategoriesFetchCount;
                subCategoryReasons.push(x);
                x = [];
              }
            }
            return this.sharedTopSubCategories(subCategoryReasons, p);
          } catch (Error) {
            return null;
          }
        })
        .then(finalData => {
          if (finalData === null) {
            return resolve(null);
          }
          return resolve(finalData);
        });
    });
  } // end getNonPaymentCategories function

  public sharedTopSubCategories(paramtersSubCategory, topReasons) {
    // this.timeFrame = this.session.filterObjValue.timeFrame;
    return new Promise(resolve => {
      this.nonPaymentService.getNonPaymentSubCategories(paramtersSubCategory).subscribe(
        data => {
          console.log('data');
          console.log(data);
          // array
          let mappedData;
          if (paramtersSubCategory[0][1].ClaimsBy === 'DateOfProcessing') {
            mappedData = data;
          } else {
            mappedData = data.map(item => item[0]);
          }
          for (let i = 0; i < topReasons.length; i++) {
            // deep copy
            if (paramtersSubCategory[i][1].ClaimsBy === 'DateOfProcessing') {
              topReasons[i]['top5'] = JSON.parse(JSON.stringify(mappedData[i].DenialCategory));
            } else {
              topReasons[i]['top5'] = JSON.parse(JSON.stringify(mappedData[i].All.DenialCategory));
            }
            topReasons[i]['top5'] = topReasons[i]['top5'].filter(
              x =>
                x.Claimdenialcategorylevel1shortname !== 'UNKNOWN' &&
                x.Claimdenialcategorylevel1shortname !== 'Paid' &&
                x.DenialAmount > 0
            );
            topReasons[i]['top5'].sort(function(a, b) {
              return b.DenialAmount - a.DenialAmount;
            }); // sort the array in Descending order , if we do a.DenialAmount - b.DenialAmount, it becomes ascending
            if (topReasons[i]['top5'].length > 5) {
              topReasons[i]['top5'] = topReasons[i]['top5'].slice(0, 5); // Slice the top Sub Categories 5 arrays
            }
            const dataWithSubCategory = topReasons[i]['top5']; // shallow copy
            let subBarSum = 0;
            for (let k = 0; k < dataWithSubCategory.length; k++) {
              subBarSum = subBarSum + dataWithSubCategory[k]['DenialAmount'];
            }

            for (let j = 0; j < dataWithSubCategory.length; j++) {
              if (
                dataWithSubCategory[j]['Claimdenialcategorylevel1shortname'] !== undefined &&
                dataWithSubCategory[j]['Claimdenialcategorylevel1shortname'] !== null
              ) {
                dataWithSubCategory[j].text = dataWithSubCategory[j]['Claimdenialcategorylevel1shortname'];
                const removeSpaces = dataWithSubCategory[j].text.replace(/[^a-zA-Z0-9]/g, '');
                dataWithSubCategory[j].id = removeSpaces;
              } else {
                dataWithSubCategory[j].text = topReasons[i]['title'];
                const removeSpaces = dataWithSubCategory[j].text.replace(/[^a-zA-Z0-9]/g, '');
                dataWithSubCategory[j].id = removeSpaces;
              }
              dataWithSubCategory[j].valueNumeric = dataWithSubCategory[j]['DenialAmount'];
              dataWithSubCategory[j].value = '$' + this.common.nFormatter(dataWithSubCategory[j]['DenialAmount']);
              dataWithSubCategory[j].barSum = subBarSum;
              delete dataWithSubCategory[j].Claimdenialcategorylevel1shortname;
              delete dataWithSubCategory[j].DenialAmount;
            }
          }
          resolve(topReasons);
        },
        error => {
          resolve(null);
          console.log('Error Shared Top Sub Categories', error);
        }
      );
    });
  }
  public sharedTopCategories(parameters) {
    // this.timeFrame = this.session.filterObjValue.timeFrame;
    return new Promise(resolve => {
      /** Get Top 5 Categories Data */
      if (parameters[1].ClaimsBy === 'DateOfProcessing') {
        this.nonPaymentService.getNonPaymentTopCategories(...parameters).subscribe(
          topCategories => {
            try {
              const topReasons: Array<object> = [];
              let tempArray: any = [];
              tempArray = JSON.parse(JSON.stringify(topCategories[0].DenialCategory)); // deep copy
              // console.log('tempArray ');
              // console.log(tempArray);
              tempArray = tempArray.filter(
                x =>
                  x.Claimdenialcategorylevel1shortname !== 'UNKNOWN' &&
                  x.Claimdenialcategorylevel1shortname !== 'Paid' &&
                  x.DenialAmount > 0
              ); // shallow copy
              tempArray.sort(function(a, b) {
                return b.DenialAmount - a.DenialAmount;
              }); // sort the array in Descending order , if we do a.DenialAmount - b.DenialAmount, it becomes ascending
              if (tempArray.length > 5) {
                tempArray = tempArray.slice(0, 5); // Slice the top 5 arrays
              }
              const topBarSum = [];
              for (let i = 0; i < tempArray.length; i++) {
                topBarSum.push(tempArray[i].DenialAmount);
              }
              const maxTopBar = Math.max(...topBarSum);
              for (let i = 0; i < tempArray.length; i++) {
                topReasons.push({
                  title: tempArray[i].Claimdenialcategorylevel1shortname,
                  value: '$' + this.common.nFormatter(tempArray[i].DenialAmount),
                  numeric: tempArray[i].DenialAmount,
                  maxValue: maxTopBar,
                  id: tempArray[i].Claimdenialcategorylevel1shortname.replace(/[^a-zA-Z0-9]/g, '') + 'topReasons',
                  timePeriod:
                    this.common.dateFormat(topCategories[0].StartDate) +
                    '&ndash;' +
                    this.common.dateFormat(topCategories[0].EndDate)
                });
              }
              resolve(topReasons);
            } catch (Error) {
              resolve(null);
            }
          },
          error => {
            resolve(null);
            console.log('Non payment Data Error ', error);
          }
        );
      } else {
        this.nonPaymentService.getNonPaymentTopCategories(...parameters).subscribe(
          ([topCategories]) => {
            try {
              const topReasons: Array<object> = [];
              let tempArray: any = [];
              tempArray = JSON.parse(JSON.stringify(topCategories.All.DenialCategory)); // deep copy
              tempArray = tempArray.filter(
                x =>
                  x.Claimdenialcategorylevel1shortname !== 'UNKNOWN' &&
                  x.Claimdenialcategorylevel1shortname !== 'Paid' &&
                  x.DenialAmount > 0
              ); // shallow copy
              tempArray.sort(function(a, b) {
                return b.DenialAmount - a.DenialAmount;
              }); // sort the array in Descending order , if we do a.DenialAmount - b.DenialAmount, it becomes ascending
              if (tempArray.length > 5) {
                tempArray = tempArray.slice(0, 5); // Slice the top 5 arrays
              }
              const topBarSum = [];
              for (let i = 0; i < tempArray.length; i++) {
                topBarSum.push(tempArray[i].DenialAmount);
              }
              const maxTopBar = Math.max(...topBarSum);
              for (let i = 0; i < tempArray.length; i++) {
                topReasons.push({
                  title: tempArray[i].Claimdenialcategorylevel1shortname,
                  value: '$' + this.common.nFormatter(tempArray[i].DenialAmount),
                  numeric: tempArray[i].DenialAmount,
                  maxValue: maxTopBar,
                  id: tempArray[i].Claimdenialcategorylevel1shortname.replace(/[^a-zA-Z0-9]/g, '') + 'topReasons',
                  timePeriod:
                    this.common.dateFormat(topCategories.Startdate) +
                    '&ndash;' +
                    this.common.dateFormat(topCategories.Enddate)
                });
              }
              resolve(topReasons);
            } catch (Error) {
              resolve(null);
            }
          },
          error => {
            resolve(null);
            console.log('Non payment Data Error ', error);
          }
        );
      }
      /** Ends Shared Top Categories Data */
    });
  } // end sharedTopCategories Function

  public ReturnMonthlyString(a) {
    if (a === '01') {
      return 'Jan';
    } else if (a === '02') {
      return 'Feb';
    } else if (a === '03') {
      return 'Mar';
    } else if (a === '04') {
      return 'Apr';
    } else if (a === '05') {
      return 'May';
    } else if (a === '06') {
      return 'Jun';
    } else if (a === '07') {
      return 'Jul';
    } else if (a === '08') {
      return 'Aug';
    } else if (a === '09') {
      return 'Sep';
    } else if (a === '10') {
      return 'Oct';
    } else if (a === '11') {
      return 'Nov';
    } else if (a === '12') {
      return 'Dec';
    }
  }

  public sharedTrendByMonth(param) {
    let parameters = [];
    parameters = this.getParameterCategories(param);
    return new Promise((resolve, reject) => {
      this.nonPaymentService.getNonPaymentTrendByMonth(parameters).subscribe(data => {
        try {
          // const lobData = this.lob;
          const nonPaymentsTrendData = JSON.parse(JSON.stringify(data));
          const filter_data_claimSummary = [];
          nonPaymentsTrendData.forEach(element => {
            let monthlyData = [];
            monthlyData = element.All.ClaimsLobSummary;
            for (let i = 0; i < monthlyData.length; i++) {
              const trendMonthValue = monthlyData[i].AmountDenied;
              const trendTimePeriod = monthlyData[i].DenialMonth;
              const trendTimePeriodArr = trendTimePeriod.split('-');
              const trendTimePeriodFinal = trendTimePeriodArr[1];
              filter_data_claimSummary.push({
                name: this.ReturnMonthlyString(trendTimePeriodFinal),
                value: trendMonthValue,
                month: trendTimePeriod
              });
            }
          });
          filter_data_claimSummary.sort(function(a, b) {
            let dateA: any;
            dateA = new Date(a.month);
            let dateB: any;
            dateB = new Date(b.month);
            return dateA - dateB; // sort by date ascending
          });
          const dataTrendLine = {
            data: filter_data_claimSummary,
            timePeriod:
              this.common.dateFormat(nonPaymentsTrendData[0].Startdate) +
              '&ndash;' +
              this.common.dateFormat(nonPaymentsTrendData[0].Enddate)
          };
          resolve(dataTrendLine);
        } catch (Error) {
          console.log('Error in Trend Line Graph NonPayments', Error);
          resolve(null);
        }
      });
    });
  }
}
