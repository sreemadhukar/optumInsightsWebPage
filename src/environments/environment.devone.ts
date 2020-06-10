// import { EnvironmentConfig } from './i.config';

/**
 * Base Environment Configuration Instance
 * MAINTAIN ALPHABETIC ORDER
 */
export const environment: any = {
  // apiProxyUrl: 'https://gateway-stage-core.optum.com/api/devone/pdr/uhci/v1/',
  apiProxyUrl: 'https://gateway-stage-core.optum.com/api/devone/pdr/uhci/v1/',
  // apiProxyUrl: 'https://gateway-stage-core.optum.com/api/devone/pdr/uhci/v1/',
  originUrl: '/',
  apiUrls: {
    ExecutiveSummaryPath: 'providersystems/',
    ProviderSystemClaimsAgg: 'agg-claims/search/v2.0/',
    ProviderSystemClaimsSummary: 'claim-metrics/',
    ProviderSystemPriorAuth: 'PriorAuthSummary/',
    SsoTokenPath: 'myinsightOptumIdHandshake',
    SsoRedirectUri:
      'https://stage-sso.uhc.com/ext/as/authorization.oauth2?pfidpadapterid=OptumIdOIDCStage&client_id=PED42235&response_' +
      'type=code&redirect_uri=https://pedui1-peddev.ocp-ctc-core-nonprod.optum.com/login&scope=openid+profile+email&state=PED&prompt=none',
    linkLoginPage: 'https://provider-stage.linkhealth.com',
    SsoLogoutUrl:
      'https://api-stage.linkhealth.com/session/signout?redirect=https://provider-stage.linkhealth.com/' +
      'content/odin/en/provider-dashboard/public/signout.html?logOut=true',
    ProvTinList: 'provider-tins/',
    LayerSevenPath: 'myinsightLayerSevenHandshake',
    URL: window.location.origin,
    LogoutEvent: 'logoutevent/',
    LDAPAuth: 'ldapauth',
    AcoPath: 'aco-provider-metrics/',
    ProviderList: 'providers',
    Appeals: 'appeals/',
    BusinessGlossary: 'business-glossaries/',
    PriorAuth: 'prior-authorizations/search/',
    RepeatContact: 'repeat-contacts/search/',
    Calls: 'issue-resolutions/',
    PaymentIntegrity: 'pi-metrics/',
    NonPayment: 'claim-metrics/',
    NonPaymentTopClaims: 'non-payment-claims/',
    NonPaymentDop: 'dop-claim-metrics/',
    NonPaymentDopTrend: 'dop-denial-trends/',
    CallsTrend: 'provider-calls/',
    TrendingMetrics: 'trending-metrics/',
    PCORQualityMeasure: 'patient-care-metrics/',
    NPSSummary: 'kop-metrics/',
    NPSQuarterlySummary: 'kop-quarterly-metrics',
    KOPPriorAuthSummary: 'kop-priorauth-metrics/',
    KOPPriorAuthTATSummary: 'kop-priorauth-tat/',
    KOPReimbursementClaims: 'kop-reimbursement-metrics/',
    AppealsTrend: 'appeals-trend/',
    AdminSummaryTrends: 'admintrends/',
    AppealsFHIR: 'claims-appeals-metrics/',
    AppealsOverturn: 'appeal-overturn-reasons/',
    AdminSummaryTrendsCount: 'admintrendscount/',
    RefreshToken: 'getRefreshToken/',
    HealthSystemDetails: 'providerInfo/',
    KOPBusinessGlossary: 'business-glossaries-kop/',
    CallsTrendLine: 'calls-trends/',
    PaymentsBySubmissionDOP: 'dop-claim-submissions/',
    PaymentsBySubmission: 'claim-submissions/',
    GroupPremiumDesignation: 'group-premium-designation/',
    NetworkLever: 'network-lever/',
    PaymentIntegrityTabsInfo: 'pi-tab-info/',
    NewPaymentIntegrity: 'payment-integrity/',
    ProviderSearch: 'provider-search',
    AdvocateTinDetails: 'advocate-tin-details/',
    SmartEdits: 'smart-edit-metrics/',
    SmartEditsTopClaims: 'smart-edit-codes/',
    getPublicKey: 'getPublicKey'
  },
  headerKeys: {
    selectedCompany: '',
    selectedRole: '',
    token: ''
  },
  production: false,
  staging: true,
  sessionTimeOutKey: '',
  sessionTimeOutWarningKey: '',
  idleTimeOut: 360,
  idleWarningTimeOut: 180,
  allowedIdleUserSession: 360,
  storageKeys: {
    activeUserStorageKey: '',
    tokenStorageKey: ''
  },
  storagePrefix: '',
  errorMessage: 'empty',
  clickStreamUrl: '//assets.adobedtm.com/launch-ENacdc6d1acf734bcd95703e446bd1de1d-development.min.js',
  internalAccess: true,
  toggleTrendingSummary: false,
  internalIntAccess: false,
  pocaService: true,
  sentryKey: 'https://2e6628201e8043c89e8fac56d77c46aa@sentry-ped-internal.ocp-ctc-core.optum.com/1'
};
