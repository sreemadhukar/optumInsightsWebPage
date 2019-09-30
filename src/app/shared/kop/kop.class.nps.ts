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

    let highlightedValue = 0;
    let targetValue = 0;
    let highlightQuarter = false;

    if (survey === 'all') {
      if (index === 0) {
        highlightQuarter = true;
      }
      highlightedValue = Math.ceil(TotalNPSValue);
      targetValue = Math.ceil(CombinedTargetNPSValue);
    } else if (survey === 'md') {
      highlightedValue = Math.ceil(PhysicianNPSValue);
      targetValue = Math.ceil(PhysicianTargetNPSValue);
    } else if (survey === 'pm') {
      highlightedValue = Math.ceil(PracticeManagerNPSValue);
      targetValue = Math.ceil(PracticeManagerTargetNPSValue);
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
    if (survey === 'all') {
      title = 'Combined Total NPS';
    } else if (survey === 'pm') {
      title = 'Practice Manager NPS';
    } else if (survey === 'md') {
      title = 'Physician NPS';
    }

    return {
      survey,
      type: 'nps',
      quarter: true,
      singleCard: this.singleCard,
      title,
      sdata: {
        sign: 'up',
        data: 'Positive Trending'
      },
      cards: []
    };
  }

  public getData() {
    return this.npsSummary;
  }
}
