// import { EnvironmentConfig } from './i.config';

/**
 * Base Environment Configuration Instance
 * MAINTAIN ALPHABETIC ORDER
 */
export const environment: any = {
  apiProxyUrl: 'http://localhost:8080/',
  originUrl: 'https://pedui2-peddev.ocp-ctc-core-nonprod.optum.com/',
  apiUrls: {
    ExecutiveSummaryPath: 'providersystems/',
    ProviderSystemClaimsAgg: 'agg-claims/search/v2.0/',
    // ProviderSystemClaimsSummary: 'claims/search/v2.0/',

    ProviderSystemClaimsSummary: 'claim-metrics/',
    ProviderSystemPriorAuth: 'PriorAuthSummary/',
    SsoTokenPath: 'myinsightOptumIdHandshake',
    SsoRedirectUri:
      'https://stage-sso.uhc.com/ext/as/authorization.oauth2?pfidpadapterid=OptumIdOIDCStage&client_id=PED42235&response_' +
      'type=code&redirect_uri=https://localhost:4200/login&scope=openid+profile+email&state=PED&prompt=none',
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
    CallsTrend: 'provider-calls/',
    TrendingMetrics: 'trending-metrics/',
    PCORQualityMeasure: 'pcor-metrics/',
    NPSSummary: 'kop-metrics/',
    KOPPriorAuthSummary: 'kop-priorauth-request/',
    KOPPriorAuthTATSummary: 'kop-priorauth-tat/',
    AppealsTrend: 'appeals-trend/',
    AdminSummaryTrends: 'admintrends/',
    AppealsFHIR: 'appeals/v2.0/',
    AppealsOverturn: 'appeal-overturn-reasons/',
    AdminSummaryTrendsCount: 'admintrendscount/',
    HealthSystemDetails: 'providerInfo/'
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
  claimsYieldAccess: false,
  toggleTrendingSummary: false,
  sentryKey: 'https://2e6628201e8043c89e8fac56d77c46aa@sentry-ped-internal.ocp-ctc-core.optum.com/1'
};
