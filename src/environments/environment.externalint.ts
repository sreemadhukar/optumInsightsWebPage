// import { EnvironmentConfig } from './i.config';

/**
 * Base Environment Configuration Instance
 * MAINTAIN ALPHABETIC ORDER
 */
export const environment: any = {
  apiProxyUrl: 'https://gateway-stage-core.optum.com/api/int/pdr/uhci/v1/',
  originUrl: '/',
  apiUrls: {
    ExecutiveSummaryPath: 'providersystems/',
    ProviderSystemClaimsAgg: 'agg-claims/search/v2.0/',
    // ProviderSystemClaimsSummary: 'claims/search/v2.0/',

    ProviderSystemClaimsSummary: 'claim-metrics/',
    ProviderSystemPriorAuth: 'PriorAuthSummary/',
    SsoTokenPath: 'myinsightOptumIdHandshake',
    SsoRedirectUri:
      'https://stage-sso.uhc.com/ext/as/authorization.oauth2?pfidpadapterid=OptumIdOIDCStage&client_id=PED42235&response_' +
      'type=code&redirect_uri=https://pedintui-pedstg.ocp-ctc-dmz-stg.optum.com/login&scope=openid+profile+email&state=PED&prompt=none',
    linkLoginPage: 'https://provider-stage.linkhealth.com',
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
    TrendingMetrics: 'trending-metrics/'
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
  toggleTrendingSummary: false
};
