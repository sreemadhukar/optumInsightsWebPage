// import { EnvironmentConfig } from './i.config';

/**
 * Base Environment Configuration Instance
 * MAINTAIN ALPHABETIC ORDER
 */
export const environment: any = {
  apiProxyUrl: 'https://gateway-core.optum.com/api/pdr/uhci/',
  originUrl: '/',
  apiUrls: {
    ExecutiveSummaryPath: 'v1/providersystems/',
    ProviderSystemClaimsAgg: 'v1/agg-claims/search/v2.0/',
    ProviderSystemClaimsSummary: 'claim-metrics/v1/',
    ProviderSystemPriorAuth: 'v1/PriorAuthSummary/',
    SsoTokenPath: 'v1/myinsightOptumIdHandshake',
    SsoRedirectUri:
      'https://sso.uhc.com/ext/as/authorization.oauth2?pfidpadapterid=OptumIdOIDCStage&client_id=PED42235&response_' +
      'type=code&redirect_uri=https://uhcinsights.uhc.com/login&scope=openid+profile+email&state=PED&prompt=none',
    linkLoginPage: 'https://provider.linkhealth.com',
    SsoLogoutUrl:
      'https://api.linkhealth.com/session/signout?redirect=https://provider.linkhealth.com/' +
      'content/odin/en/provider-dashboard/public/signout.html?logOut=true',
    ProvTinList: 'v1/provider-tins/',
    LayerSevenPath: 'v1/myinsightLayerSevenHandshake',
    URL: window.location.origin,
    LogoutEvent: 'v1/logoutevent/',
    LDAPAuth: 'v1/ldapauth',
    AcoPath: 'v1/aco-provider-metrics/',
    ProviderList: 'v1/providers',
    Appeals: 'v1/appeals/',
    BusinessGlossary: 'v1/business-glossaries/',
    PriorAuth: 'v1/prior-authorizations/search/',
    RepeatContact: 'v1/repeat-contacts/search/',
    Calls: 'v1/issue-resolutions/',
    PaymentIntegrity: 'v1/pi-metrics/',
    NonPayment: 'claim-metrics/v1/',
    NonPaymentTopClaims: 'v1/non-payment-claims/',
    NonPaymentDop: 'dop-claim-metrics/v1/',
    NonPaymentDopTrend: 'dop-denial-trends/v1/',
    CallsTrend: 'provider-calls/v1/',
    TrendingMetrics: 'v1/trending-metrics/',
    PCORQualityMeasure: 'v1/patient-care-metrics/',
    NPSSummary: 'v1/kop-metrics/',
    NPSQuarterlySummary: 'v1/kop-quarterly-metrics',
    KOPPriorAuthSummary: 'v1/kop-priorauth-metrics/',
    KOPPriorAuthTATSummary: 'v1/kop-priorauth-tat/',
    KOPReimbursementClaims: 'v1/kop-reimbursement-metrics/',
    AppealsTrend: 'v1/appeals-trend/',
    AdminSummaryTrends: 'v1/admintrends/',
    AppealsFHIR: 'v1/claims-appeals-metrics/',
    AppealsOverturn: 'v1/appeal-overturn-reasons/',
    AdminSummaryTrendsCount: 'v1/admintrendscount/',
    RefreshToken: 'v1/getRefreshToken/',
    HealthSystemDetails: 'v1/providerInfo/',
    KOPBusinessGlossary: 'v1/business-glossaries-kop/',
    CallsTrendLine: 'v1/calls-trends/',
    PaymentsBySubmissionDOP: 'dop-claim-submissions/v1/',
    PaymentsBySubmission: 'claim-submissions/v1/',
    GroupPremiumDesignation: 'v1/group-premium-designation/',
    NetworkLever: 'v1/network-lever/',
    PaymentIntegrityTabsInfo: 'v1/pi-tab-info/',
    // NewPaymentIntegrity: 'payment-integrity/' // please uncomment this when new-PI i allowed in prod
    SmartEdits: 'smart-edit-metrics/',
    SmartEditsTopClaims: 'smart-edit-codes/',
    ProviderSearch: 'v1/provider-search',
    AdvocateTinDetails: 'v1/advocate-tin-details/',
    getPublicKey: 'v1/getPublicKey'
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
  sentryKey: 'https://2f1705a86c9343c98b6df3981f59e995@sentry-ped-internal.ocp-ctc-core.optum.com/5'
};
