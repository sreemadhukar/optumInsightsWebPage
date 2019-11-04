/**
 * Base Environment Configuration Instance
 * MAINTAIN ALPHABETIC ORDER
 */
export const environment: any = {
  apiProxyUrl: '/uhci/prd2/',
  originUrl: '/',
  apiUrls: {
    ExecutiveSummaryPath: 'providersystems/',
    ProviderSystemClaimsAgg: 'agg-claims/search/v2.0/',
    ProviderSystemClaimsSummary: 'claim-metrics/',
    ProviderSystemPriorAuth: 'PriorAuthSummary/',
    SsoTokenPath: 'myinsightOptumIdHandshake/v2.0',
    SsoRedirectUri:
      'https://sso.uhc.com/ext/as/authorization.oauth2?pfidpadapterid=OptumIdOIDC&client_id=PED42235&' +
      'response_type=code&redirect_uri=https://uhcinsights.uhc.com/login&scope=openid+profile+email&state=PED&prompt=none',
    linkLoginPage: 'https://provider.linkhealth.com',
    SsoLogoutUrl: 'https://provider.linkhealth.com/api/link/session/signout&redirect=https://provider.linkhealth.com',
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
    CallsTrend: 'provider-calls/',
    TrendingMetrics: 'trending-metrics/',
    PCORQualityMeasure: 'pcor-metrics/',
    NPSSummary: 'kop-metrics/',
    AppealsTrend: 'appeals-trend/',
    AdminSummaryTrends: 'admintrends/',
    AppealsFHIR: 'appeals/v2.0/',
    AppealsOverturn: 'appeal-overturn-reasons/',
    AdminSummaryTrendsCount: 'admintrendscount/'
  },
  headerKeys: {
    selectedCompany: '',
    selectedRole: '',
    token: ''
  },
  production: true,
  staging: false,
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
  claimsYieldAccess: false,
  toggleTrendingSummary: false,
  sentryKey: 'https://2e6628201e8043c89e8fac56d77c46aa@sentry-ped-internal.ocp-ctc-core.optum.com/1'
};
