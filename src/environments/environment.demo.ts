/**
 * Base Environment Configuration Instance
 * MAINTAIN ALPHABETIC ORDER
 */
export const environment: any = {
  // apiProxyUrl: '/uhci/prd2/',
  apiProxyUrl: 'https://gateway-stage-core.optum.com/api/demo/pdr/uhci/v1/',
  originUrl: '/',
  apiUrls: {
    ExecutiveSummaryPath: 'providersystems/',
    ProviderSystemClaimsAgg: 'agg-claims/search/',
    ProviderSystemClaimsSummary: 'claim-metrics/',
    ProviderSystemPriorAuth: 'PriorAuthSummary/',
    // SsoTokenPath: 'myinsightOptumIdHandshake/v2.0',
    SsoTokenPath: 'myinsightOptumIdHandshake',
    // SsoRedirectUri:
    //   'https://sso.uhc.com/ext/as/authorization.oauth2?pfidpadapterid=OptumIdOIDC&client_id=PED42235&response_' +
    //   'type=code&redirect_uri=https://myinsights.uhc.com/login&scope=openid+profile+email&state=PED&prompt=none',
    SsoRedirectUri:
      'https://stage-sso.uhc.com/ext/as/authorization.oauth2?pfidpadapterid=OptumIdOIDCStage&client_id=PED42235&' +
      'response_type=code&redirect_uri=https://uhcinsights-demo.uhc.com/login&scope=openid+profile+email&state=PED&prompt=none',
    linkLoginPage: 'https://provider-stage.linkhealth.com',
    // SsoLogoutUrl: 'https://provider.linkhealth.com/api/link/session/signout&redirect=https://provider.linkhealth.com',
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
    NonPaymentDopTrend: 'dop-denial-trend/',
    CallsTrend: 'provider-calls/',
    TrendingMetrics: 'trending-metrics/',
    PCORQualityMeasure: 'pcor-metrics/',
    NPSSummary: 'kop-metrics/',
    NPSQuarterlySummary: 'kop-quarterly-metrics',
    KOPPriorAuthSummary: 'kop-priorauth-metrics/',
    KOPPriorAuthTATSummary: 'kop-priorauth-tat/',
    KOPReimbursementClaims: 'kop-reimbursement-metrics/',
    AppealsTrend: 'appeals-trend/',
    AdminSummaryTrends: 'admintrends/',
    AppealsFHIR: 'appeals/v2.0/',
    AppealsOverturn: 'appeal-overturn-reasons/',
    AdminSummaryTrendsCount: 'admintrendscount/',
    RefreshToken: 'getRefreshToken/',
    HealthSystemDetails: 'providerInfo/',
    KOPBusinessGlossary: 'business-glossaries-kop/',
    CallsTrendLine: 'calls-trend/',
    PaymentsBySubmission: 'claim-submissions/'
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
  internalAccess: false,
  toggleTrendingSummary: false,
  sentryKey: 'https://2e6628201e8043c89e8fac56d77c46aa@sentry-ped-internal.ocp-ctc-core.optum.com/1'
};
