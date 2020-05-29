/**
 * Base Environment Configuration Instance
 * MAINTAIN ALPHABETIC ORDER
 */
export const config = {
  originUrl: 'https://pedintui-pedstg.ocp-ctc-dmz-stg.optum.com/',
  intApi: 'https://pedintapi-pedtst.ocp-ctc-core-nonprod.optum.com/',
  devOneApi: 'https://pedapi1-peddev.ocp-ctc-core-nonprod.optum.com/',
  devTwoApi: 'https://pedapi2-peddev.ocp-ctc-core-nonprod.optum.com/',
  devThreeApi: 'https://gateway-stage-core.optum.com/api/devthree/pdr/uhci/v1/',
  stageApi: 'https://pedapiuhc-pedstgapp.origin-ctc-core.optum.com/'
};

export const environment: any = {
  /*
  /*
  QA1 pointing to INT environment to interact with INT API
  apiProxyUrl: 'https://gateway-stage-core.optum.com/api/int/pdr/uhci/v1/',
  originUrl: 'https://pedintui-pedstg.ocp-ctc-dmz-stg.optum.com/',
  apiProxyUrl: 'https://pedintapi-pedtst.ocp-ctc-core-nonprod.optum.com/',
  */
  // *In Local use dev3
  // apiProxyUrl: 'https://nginx-pedtst.ocp-ctc-core-nonprod.optum.com/',
  // originUrl: 'https://pedintui-pedstg.ocp-ctc-dmz-stg.optum.com/',
  // apiProxyUrl: 'https://pedapiuhc-pedstgapp.origin-ctc-core.optum.com/',
  // stage
  apiProxyUrl: config.intApi,
  originUrl: config.originUrl,

  apiUrls: {
    ExecutiveSummaryPath: 'providersystems/',
    ProviderSystemClaimsAgg: 'agg-claims/search/v2.0/',
    // ProviderSystemClaimsSummary: 'claims/search/v2.0/',

    ProviderSystemClaimsSummary: 'claim-metrics/',
    ProviderSystemPriorAuth: 'PriorAuthSummary/',
    SsoTokenPath: 'myinsightOptumIdHandshake',
    SsoRedirectUri:
      'https://stage-sso.uhc.com/ext/as/authorization.oauth2?pfidpadapterid=OptumIdOIDCStage&client_id=PED42235&response_' +
      'type=code&redirect_uri=https://pedui3-peddev.ocp-ctc-core-nonprod.optum.com/login&scope=openid+profile+email&state=PED&prompt=none',
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
    NonPaymentDop: 'dop-claim-metrics/',
    NonPaymentDopTrend: 'dop-denial-trends/',
    NonPaymentTopClaims: 'non-payment-claims/',
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
  sentryKey: 'https://238b4f0a54d44e6186fb9eeab3bb0f20@sentry-ped-internal.ocp-ctc-core.optum.com/2',
  noSentry: true
};
