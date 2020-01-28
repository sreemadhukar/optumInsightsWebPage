export const FILTER_MASTER_DATA = [
  {
    title: 'Last Completed Quarter',
    selected: false,
    default: false,
    quarterFormat: 'default',
    timeFrameFormat: 'Quarter and Year',
    filters: ['LAST_COMPLETED_QUARTER'],
    priorAuthFilters: ['LAST_COMPLETED_QUARTER']
  },
  {
    title: 'Year To Date',
    selected: false,
    default: false,
    timeFrameFormat: 'Year',
    quarterFormat: 'default',
    filters: ['YEAR_TO_DATE'],
    priorAuthFilters: ['YEAR_TO_DATE']
  },
  {
    title: 'Quarter over Quarter',
    selected: true,
    default: true,
    timeFrameFormat: 'Quarter vs Quarter',
    quarterFormat: 'default',
    filters: ['QUARTER_OVER_QUARTER'],
    priorAuthFilters: ['LAST_COMPLETED_QUARTER', 'QUARTER_OVER_QUARTER']
  },
  {
    title: 'Total Last Year',
    selected: false,
    default: false,
    timeFrameFormat: 'Last Year',
    quarterFormat: 'YTD',
    filters: ['YEAR_TO_DATE', 'TOTAL_LAST_YEAR'],
    priorAuthFilters: ['YEAR_TO_DATE', 'TOTAL_LAST_YEAR']
  }
];
