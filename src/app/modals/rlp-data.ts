export interface IrlpHeader {
  title: string;
  subTitle: string;
}
export interface IrlpPages {
  Summary: any;
  Referral: any;
  Labs: any;
  Perscription: any;
}

export interface ItableType {
  thead: Array<string>;
  tbody: any;
}

export const endpointsHCO = {
  labs: 'LAB_VISITS_HCO',
  referral: 'SPECIALIST_REFERRAL_HCO',
  perscription: 'PRESCRIBING_PROVIDER_HCO'
};

export const endpointsTIN = {
  labs: 'LAB_VISITS_TIN',
  referral: 'SPECIALIST_REFERRAL_TIN',
  perscription: 'PRESCRIBING_PROVIDER_TIN'
};

export const rlpCardType = {
  appCard: 'app-card',
  longCard: 'app-large-card'
};

export const rlpBarType = {
  appCard: 'rlp-small-bar',
  longCard: 'rlp-large-bar',
  table: 'rlp-table-bar'
};

export const rlpPageName: IrlpPages = {
  Summary: 'Summary',
  Referral: 'Referral',
  Labs: 'Labs',
  Perscription: 'Perscription'
};
// This is for dropdown size of the table
export const pageSizeConf: Array<string> = ['25', '50', '100'];
// This is initialize the pagination
export const INITIAL_PAGINATION = {
  currentPageNumber: 1,
  setIndex: 0,
  endIndex: +pageSizeConf[0]
};

// This is for table static data
export const staticTableData: IrlpPages = {
  Summary: '',
  Referral: ['TIN', 'Group Name', 'Preferred Specialist Referral Rate'],
  Labs: ['TIN', 'Group Name', 'Preferred Lab Network Use Rate'],
  Perscription: ['TIN', 'Group Name', 'Preferred Tier Prescribing Rate']
};

// This is for table title and subtitle
export const rlpPageConf: IrlpPages = {
  Summary: {
    title: 'Performance Management Summary',
    subTitle: `Improve your performance through rendering, ordering, prescribing and
    referring actions that achieve lower total cost of care.`
  },
  Referral: {
    title: 'Preferred Specialist Referral Rate',
    subTitle: `This measure's objective is to evaluate referrals by primary care physicians (PCPs)
    to high performing specialists who have demonstrated a high-quality and lower total cost of care performance.`
  },
  Labs: {
    title: 'Preferred Lab Network Use Rate',
    subTitle: `This measure's objective is to evaluate use of the Preferred Lab Network which is
    comprised of independent labs that have demonstrated high standards for quality, services and affordability.`
  },
  Perscription: {
    title: 'Preferred Tier Prescribing Rate',
    subTitle: `This measure's objective is to evaluate rate of prescribing of Preferred Tiers 1 and 2
    which typically have a lower cost than higher tier drugs.`
  }
};
export const rlpData: any = {
  data: [
    {
      tin: '56-1234567',
      groupName: 'North Region Orthopedic Geneisi Health Organization',
      graphData: {
        data1: 88,
        data2: 64,
        total: 152,
        percentage: '%'
      }
    },
    {
      tin: '24-1234657',
      groupName: 'Sunil Gavaskar',
      graphData: {
        data1: 28,
        data2: 74,
        total: 102,
        percentage: '%'
      }
    },
    {
      tin: '87-1244567',
      groupName: 'Rohit Sharma',
      graphData: {
        data1: 72,
        data2: 28,
        total: 100,
        percentage: '%'
      }
    },
    {
      tin: '98-4234567',
      groupName: 'Virat Kohli',
      graphData: {
        data1: 25,
        data2: 55,
        total: 80,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Sachin Tendulkar',
      graphData: {
        data1: 79,
        data2: 26,
        total: 105,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Upashna Ghosh',
      graphData: {
        data1: 55,
        data2: 42,
        total: 97,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Inderjeet Vashista',
      graphData: {
        data1: 89,
        data2: 22,
        total: 111,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Mahummad Gogoi',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
        percentage: '%'
      }
    }
  ]
};
