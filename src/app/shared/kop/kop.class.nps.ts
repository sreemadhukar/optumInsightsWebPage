import { Trends } from './common/kop.class.trends';

export class NPSSummary {
  public singleCard = false;
  public records: any;
  public npsSummary = {
    title: 'Provider NPS Summary',
    data: []
  };
  constructor({ records }) {
    this.records = records;
    this.singleCard = records.length === 1 ? true : false;
    this.createCards();
    if (!this.singleCard) {
      this.createTrend();
    }
  }

  public createCards() {
    const surveys = ['all', 'pm', 'md'];
    surveys.forEach((survey: string) => {
      const npsCard = this.createNPSCard({ survey });
      const npsInnerCards = [];
      this.records.forEach((record, index) => {
        const innerCard = this.createNPSInnerCard({ survey, record, index });
        npsInnerCards.push(innerCard);
      });
      npsCard.cards = npsInnerCards;
      this.npsSummary.data.push(npsCard);
    });
  }

  public createTrend() {
    this.npsSummary.data.forEach((dataItem: any) => {
      const { cards } = dataItem;
      const [{ highlightedValue: value1 }, { highlightedValue: value2 }] = cards;
      const trendsData = new Trends({ value1, value2 });
      dataItem.sdata = trendsData.getData();
    });
  }

  public createNPSInnerCard(params: any) {
    const { survey, record, index } = params;
    const {
      Year,
      ProviderNpsSummary: {
        PhysicianNPSSummary: { PhysicianNPSValue },
        PracticeManagerNPSSummary: { PracticeManagerNPSValue },
        TotalNPSSummary: { TotalNPSValue },
        TargetNPSSummary: { CombinedTargetNPSValue = 0, PhysicianTargetNPSValue = 0, PracticeManagerTargetNPSValue = 0 }
      }
    } = record;

    let currentQuarter = false;
    let prevQuarter = true;
    if (index === 0) {
      currentQuarter = true;
      prevQuarter = false;
    }

    let highlightedValue;
    let targetValue;
    let highlightQuarter = false;

    if (survey === 'all' && TotalNPSValue && CombinedTargetNPSValue) {
      if (index === 0) {
        highlightQuarter = false;
      }
      highlightedValue = Math.round(TotalNPSValue);
      targetValue = Math.round(CombinedTargetNPSValue);
    } else if (survey === 'md' && TotalNPSValue && CombinedTargetNPSValue) {
      highlightedValue = Math.round(PhysicianNPSValue);
      targetValue = Math.round(PhysicianTargetNPSValue);
    } else if (survey === 'pm' && TotalNPSValue && CombinedTargetNPSValue) {
      highlightedValue = Math.round(PracticeManagerNPSValue);
      targetValue = Math.round(PracticeManagerTargetNPSValue);
    }
    return {
      highlightedValue,
      targetValue,
      highlightQuarter,
      currentQuarter,
      prevQuarter,
      captionText: Year + ' Target'
    };
  }

  public createNPSCard(params: any) {
    const { survey } = params;

    let title = '';
    let MetricID = '';
    if (survey === 'all') {
      title = 'Combined Total NPS';
      MetricID = '35';
    } else if (survey === 'pm') {
      title = 'Practice Manager NPS';
      MetricID = '36';
    } else if (survey === 'md') {
      title = 'Physician NPS';
      MetricID = '37';
    }

    return {
      survey,
      type: 'nps',
      quarter: true,
      singleCard: this.singleCard,
      title,
      MetricID,
      cards: []
    };
  }

  public getData() {
    return this.npsSummary;
  }
}
