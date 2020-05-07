import { Component, OnInit, Input } from '@angular/core';
import { OverviewSharedService } from '../../../shared/overview/overview-shared.service';
import { SessionService } from '../../../shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonUtilsService } from 'src/app/shared/common-utils.service';
import { NgRedux } from '@angular-redux/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @Input() printStyle;
  countSmallCard: number;
  countMiniTile: number;
  overviewItems: any;
  mainCards: any;
  mockMainCards: Array<any>;
  selfServiceMiniCards: any;
  pageTitle: string;
  pagesubTitle: string;
  userName: string;
  opportunities: string;
  selfServiceLink: string;
  selfServiceLinkParam: Object;
  opportunitiesQuestion: string;
  welcomeMessage: string;
  subscription: any;
  loading = false;
  claimsLoading = false;
  callsLoading = false;
  priorAuthLoading = false;
  /***************** DONT CHANGE THESE *************/
  claimsPaidBlock: any;
  priorAuthBlock: any;
  selfServiceAdoptionBlock: any;
  claimsYieldBlock: any;
  claimsTatBlock: any;
  medicareStarRatingBlock: any;
  totalCallsBlock: any;

  loadClaimsPaidCard = false;
  loadClaimsYieldCard = false;
  loadclaimsTatCard = false;
  loadPrioirAuthCard = false;
  loadselfServiceAdoptionCard = false;
  loadMedicareStarRatingCard = false;
  loadTotalCallsCard = false;

  errorloadClaimsPaidCard = false;
  errorloadClaimsYieldCard = false;
  errorloadClaimsTatCard = false;
  errorloadPrioirAuthCard = false;
  errorloadselfServiceAdoptionCard = false;
  errorloadMedicareStarRatingCard = false;
  errorloadTotalCallsCard = false;
  isHeac = false;
  /***************** DONT CHANGE THESE *************/
  trendsData: any;

  constructor(
    private overviewsrc: OverviewSharedService,
    private checkStorage: StorageService,
    private session: SessionService,
    private iconRegistry: MatIconRegistry,
    private filtermatch: CommonUtilsService,
    private ngRedux: NgRedux<IAppState>,
    private sanitizer: DomSanitizer,
    public sessionService: SessionService
  ) {
    this.selfServiceLink = 'Self Service Details';
    this.opportunities = 'Opportunities';
    this.opportunitiesQuestion = 'How much can online self service save you?';
    this.welcomeMessage = '';
    this.countSmallCard = 0;
    this.countMiniTile = 0;
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    this.iconRegistry.addSvgIcon(
      'arrow',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/src/assets/images/icons/Action/baseline-keyboard_arrow_right-24px.svg'
      )
    );
  }

  ngOnInit() {
    this.setHeader();
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'overviewPage' });
    // Temporary Heac ability
    const heac = JSON.parse(sessionStorage.getItem('heac'));
    this.isHeac = heac && heac.heac === true ? true : false;
    this.checkStorage.emitEvent('overviewPage');
    this.overviewsrc.getAllTrends().then(trendData => {
      this.trendsData = trendData;
      // temporary switch off of trend in calls : Srikar Bobbiganipalli
      if (this.trendsData && this.trendsData.hasOwnProperty('TendingMtrics')) {
        this.trendsData.TendingMtrics.CcllTalkTimeByQuesType = undefined;
        this.trendsData.TendingMtrics.CallsTrendByQuesType = undefined;
      }
      this.claimsLoading = true;

      /* SERVICE CALL TO GET CLAIMS CARDS DATA */
      this.overviewsrc
        .getClaimsCards()
        .then(data => {
          this.loadClaimsPaidCard = false;
          this.loadClaimsYieldCard = false;
          this.loadclaimsTatCard = false;

          this.errorloadClaimsPaidCard = false;
          this.errorloadClaimsYieldCard = false;
          this.errorloadClaimsTatCard = false;

          this.claimsLoading = false;
          this.claimsPaidBlock = data[0];
          this.claimsYieldBlock = data[1];
          this.claimsTatBlock = data[2];
          if (this.claimsPaidBlock.data != null && this.claimsPaidBlock.toggle) {
            this.loadClaimsPaidCard = true;
            this.countSmallCard++;
          } else if (this.claimsPaidBlock.status != null && this.claimsPaidBlock.toggle) {
            this.errorloadClaimsPaidCard = true;
          }
          if (this.claimsYieldBlock.data != null && this.claimsYieldBlock.toggle) {
            this.loadClaimsYieldCard = true;
            this.countSmallCard++;
          } else if (this.claimsYieldBlock.status != null && this.claimsYieldBlock.toggle) {
            this.errorloadClaimsYieldCard = true;
          }
          if (this.claimsTatBlock.data != null) {
            this.loadclaimsTatCard = true;
            this.countSmallCard++;
          } else if (this.claimsTatBlock.status != null) {
            this.errorloadClaimsTatCard = true;
          }
        })
        .catch(reason => {
          this.claimsLoading = true;
          console.log(reason);
        });

      /* SERVICE CALL TO GET DATA FOR PRIOR AUTH CARD */
      this.priorAuthLoading = true;
      this.overviewsrc
        .getPriorAuthCardData()
        .then(data => {
          this.loadPrioirAuthCard = false;
          this.errorloadPrioirAuthCard = false;
          this.priorAuthLoading = false;
          this.priorAuthBlock = data;
          if (this.priorAuthBlock.data != null && this.priorAuthBlock.toggle) {
            this.loadPrioirAuthCard = true;
            this.countSmallCard++;
          } else if (this.priorAuthBlock.status != null && this.priorAuthBlock.toggle) {
            this.errorloadPrioirAuthCard = true;
          }
        })
        .catch(reason => {
          this.priorAuthLoading = true;
          console.log(reason);
        });
      /* SERVICE CALL TO GET DATA FOR CALLS CARD */
      this.callsLoading = true;
      this.overviewsrc
        .getTotalCallsCardData(this.trendsData)
        .then(data => {
          this.callsLoading = false;
          this.loadTotalCallsCard = false;
          this.errorloadTotalCallsCard = false;
          this.totalCallsBlock = data;
          if (this.totalCallsBlock.data != null && this.totalCallsBlock.toggle) {
            this.loadTotalCallsCard = true;
            this.countSmallCard++;
          } else if (this.totalCallsBlock.status != null && this.totalCallsBlock.toggle) {
            this.errorloadTotalCallsCard = true;
          }
        })
        .catch(reason => {
          this.callsLoading = true;
          console.log(reason);
        });

      /***************** DON"T CHANGE THESE *************/
      this.loading = true;
      this.mockMainCards = [{}, {}, {}, {}, {}, {}];
      this.overviewItems = [];
      this.mainCards = [];
      this.selfServiceMiniCards = [];
      this.overviewsrc
        .getOverviewData()
        .then(data => {
          this.loadselfServiceAdoptionCard = false;
          this.loadMedicareStarRatingCard = false;

          this.errorloadselfServiceAdoptionCard = false;
          this.errorloadMedicareStarRatingCard = false;

          this.loading = false;
          this.overviewItems = data;
          this.mainCards = this.overviewItems[0];

          this.selfServiceAdoptionBlock = this.mainCards[0];
          this.medicareStarRatingBlock = this.mainCards[1];

          if (this.selfServiceAdoptionBlock.data != null && this.selfServiceAdoptionBlock.toggle) {
            this.loadselfServiceAdoptionCard = true;
            this.countSmallCard++;
          } else if (this.selfServiceAdoptionBlock.status != null && this.selfServiceAdoptionBlock.toggle) {
            this.errorloadselfServiceAdoptionCard = true;
          }
          if (this.medicareStarRatingBlock.data != null && this.medicareStarRatingBlock.toggle) {
            this.loadMedicareStarRatingCard = true;
          } else if (this.medicareStarRatingBlock.status != null && this.medicareStarRatingBlock.toggle) {
            this.errorloadMedicareStarRatingCard = true;
          }

          this.selfServiceMiniCards = this.overviewItems[1];
          for (let i = 0; i < this.selfServiceMiniCards.length; i++) {
            if (this.selfServiceMiniCards[i].data) {
              this.countMiniTile++;
            }
          }
        })
        .catch(reason => {
          this.loading = true;
          console.log(reason);
        });
    });
  }

  setHeader() {
    const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
    this.userName =
      this.session.sessionStorage('loggedUser', 'LastName') +
      ' ' +
      this.session.sessionStorage('loggedUser', 'FirstName');

    if (this.printStyle) {
      this.pageTitle = this.sessionService.getHealthCareOrgName();
      this.pagesubTitle = 'Overview - Your Insights at a glance.';
      this.opportunitiesQuestion = 'Opportunities - How much can online self service save you';
      this.selfServiceLinkParam = null;
      this.opportunities = '';
    } else {
      this.pageTitle = 'Hello, ' + userInfo.FirstName + '.';
      this.pagesubTitle = 'Your Insights at a glance.';
      this.opportunities = 'Opportunities';
      this.selfServiceLinkParam = { title: this.selfServiceLink, path: '/ServiceInteraction/SelfService' };
      this.opportunitiesQuestion = 'How much can online self service save you?';
    }
  }
}
