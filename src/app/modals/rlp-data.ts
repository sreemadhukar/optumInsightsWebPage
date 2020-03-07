export const pageSizeConf: Array<string> = ['25', '50', '100'];

export const INITIAL_PAGINATION = {
  currentPageNumber: 1,
  setIndex: 0,
  endIndex: +pageSizeConf[0]
};

export interface IrlpHeader {
  title: string;
  subTitle: string;
}
export const rlpPageConf = {
  Summary: {
    title: 'Performance Management Summary',
    subTitle: `Improve your performance through rendering, ordering, prescribing and
    referring actions that achieve lower total cost of care.`
  },
  Referral: {
    title: 'Preferred Specialist Referral Rate',
    subTitle: `Here is where our optional page title description text would live if we needed to use it.
    You can easily remove this from the design by hiding it in your symbol overrides. Please DO NOT detach this symbol.`
  },
  Labs: {
    title: 'Preferred Lab Network Use Rate',
    subTitle: `Here is where our optional page title description text would live if we needed to use it. You can easily
     remove this from the design by
     hiding it in your symbol overrides. Please DO NOT detach this symbol.`
  },
  Perscription: {
    title: 'Preferred Tier Prescribing Rate',
    subTitle: `Here is where our optional page title description text would live if we needed to use it.
    You can easily remove this from the design
    by hiding it in your symbol overrides. Please DO NOT detach this symbol.`
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
      tin: '56-12358967',
      groupName: 'Virender Sehwag',
      graphData: {
        data1: 28,
        data2: 64,
        total: 92,
        percentage: '%'
      }
    },
    {
      tin: '44-12358967',
      groupName: 'Ishant Sharma',
      graphData: {
        data1: 92,
        data2: 26,
        total: 108,
        percentage: '%'
      }
    },
    {
      tin: '11-12358967',
      groupName: 'Kevin Peterson',
      graphData: {
        data1: 38,
        data2: 64,
        total: 102,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Finch Andrew',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'David Warner',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Ricky Ponting',
      graphData: {
        data1: 34,
        data2: 66,
        total: 100,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Mitchel Johnson',
      graphData: {
        data1: 34,
        data2: 44,
        total: 78,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Sara Khan',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
        percentage: '%'
      }
    },
    {
      tin: '11-12358967',
      groupName: 'Saif Ali Khan',
      graphData: {
        data1: 38,
        data2: 64,
        total: 102,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Salman Khan',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Shah Rukh Khan',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Rohan Gavaskar',
      graphData: {
        data1: 34,
        data2: 66,
        total: 100,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Ajay Sharma',
      graphData: {
        data1: 34,
        data2: 44,
        total: 78,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Ritu Sharma',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
        percentage: '%'
      }
    },
    {
      tin: '11-12358967',
      groupName: 'Mahatama Gandhi',
      graphData: {
        data1: 38,
        data2: 64,
        total: 102,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Brack Obama',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'John Cena',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Undertaker',
      graphData: {
        data1: 34,
        data2: 66,
        total: 100,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Starc',
      graphData: {
        data1: 34,
        data2: 44,
        total: 78,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Javed Akhtar',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Arwind Kejrwal',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
        percentage: '%'
      }
    },
    {
      tin: '11-12358967',
      groupName: 'Mayank Agarwal',
      graphData: {
        data1: 38,
        data2: 64,
        total: 102,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Ranbir Kapoor',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Kareena Kapoor',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Laila mai Laila',
      graphData: {
        data1: 34,
        data2: 66,
        total: 209,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Karishma Kapoor',
      graphData: {
        data1: 34,
        data2: 44,
        total: 578,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Rinku Afridi',
      graphData: {
        data1: 20,
        data2: 66,
        total: 87,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Ranbir Kapoor',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Kareena Kapoor',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Shushma Swaraj',
      graphData: {
        data1: 34,
        data2: 66,
        total: 590,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Karishma Kapoor',
      graphData: {
        data1: 34,
        data2: 44,
        total: 578,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Vivke Afridi',
      graphData: {
        data1: 20,
        data2: 66,
        total: 798,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Ranbir Kapoor',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Kareena Kapoor',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Rahul Gandhi',
      graphData: {
        data1: 34,
        data2: 66,
        total: 550,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Karishma Kapoor',
      graphData: {
        data1: 34,
        data2: 44,
        total: 578,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Mounika Afridi',
      graphData: {
        data1: 20,
        data2: 66,
        total: 7,
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
      tin: '56-12358967',
      groupName: 'Virender Sehwag',
      graphData: {
        data1: 28,
        data2: 64,
        total: 92,
        percentage: '%'
      }
    },
    {
      tin: '44-12358967',
      groupName: 'Ishant Sharma',
      graphData: {
        data1: 92,
        data2: 26,
        total: 108,
        percentage: '%'
      }
    },
    {
      tin: '11-12358967',
      groupName: 'Kevin Peterson',
      graphData: {
        data1: 38,
        data2: 64,
        total: 102,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Finch Andrew',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'David Warner',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Ricky Ponting',
      graphData: {
        data1: 34,
        data2: 66,
        total: 100,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Mitchel Johnson',
      graphData: {
        data1: 34,
        data2: 44,
        total: 78,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Sara Khan',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
        percentage: '%'
      }
    },
    {
      tin: '11-12358967',
      groupName: 'Saif Ali Khan',
      graphData: {
        data1: 38,
        data2: 64,
        total: 102,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Salman Khan',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Shah Rukh Khan',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Rohan Gavaskar',
      graphData: {
        data1: 34,
        data2: 66,
        total: 100,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Ajay Sharma',
      graphData: {
        data1: 34,
        data2: 44,
        total: 78,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Ritu Sharma',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
        percentage: '%'
      }
    },
    {
      tin: '11-12358967',
      groupName: 'Mahatama Gandhi',
      graphData: {
        data1: 38,
        data2: 64,
        total: 102,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Brack Obama',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'John Cena',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Undertaker',
      graphData: {
        data1: 34,
        data2: 66,
        total: 100,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Starc',
      graphData: {
        data1: 34,
        data2: 44,
        total: 78,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Javed Akhtar',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Arwind Kejrwal',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
        percentage: '%'
      }
    },
    {
      tin: '11-12358967',
      groupName: 'Mayank Agarwal',
      graphData: {
        data1: 38,
        data2: 64,
        total: 102,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Ranbir Kapoor',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Kareena Kapoor',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Harry Potter',
      graphData: {
        data1: 34,
        data2: 66,
        total: 2009,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Karishma Kapoor',
      graphData: {
        data1: 34,
        data2: 44,
        total: 578,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Praveen Afridi',
      graphData: {
        data1: 20,
        data2: 66,
        total: 89,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Ranbir Kapoor',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Kareena Kapoor',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'WHO',
      graphData: {
        data1: 34,
        data2: 66,
        total: 50,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Karishma Kapoor',
      graphData: {
        data1: 34,
        data2: 44,
        total: 578,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Sonam kappor Afridi',
      graphData: {
        data1: 20,
        data2: 66,
        total: 446,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Ranbir Kapoor',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Kareena Kapoor',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Peace',
      graphData: {
        data1: 34,
        data2: 66,
        total: 10,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Karishma Kapoor',
      graphData: {
        data1: 34,
        data2: 44,
        total: 578,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Shahid Afridi',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
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
      tin: '56-12358967',
      groupName: 'Virender Sehwag',
      graphData: {
        data1: 28,
        data2: 64,
        total: 92,
        percentage: '%'
      }
    },
    {
      tin: '44-12358967',
      groupName: 'Ishant Sharma',
      graphData: {
        data1: 92,
        data2: 26,
        total: 108,
        percentage: '%'
      }
    },
    {
      tin: '11-12358967',
      groupName: 'Kevin Peterson',
      graphData: {
        data1: 38,
        data2: 64,
        total: 102,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Finch Andrew',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'David Warner',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Ricky Ponting',
      graphData: {
        data1: 34,
        data2: 66,
        total: 100,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Mitchel Johnson',
      graphData: {
        data1: 34,
        data2: 44,
        total: 78,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Sara Khan',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
        percentage: '%'
      }
    },
    {
      tin: '11-12358967',
      groupName: 'Saif Ali Khan',
      graphData: {
        data1: 38,
        data2: 64,
        total: 102,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Salman Khan',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Shah Rukh Khan',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Rohan Gavaskar',
      graphData: {
        data1: 34,
        data2: 66,
        total: 100,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Ajay Sharma',
      graphData: {
        data1: 34,
        data2: 44,
        total: 78,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Ritu Sharma',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
        percentage: '%'
      }
    },
    {
      tin: '11-12358967',
      groupName: 'Mahatama Gandhi',
      graphData: {
        data1: 38,
        data2: 64,
        total: 102,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Brack Obama',
      graphData: {
        data1: 45,
        data2: 45,
        total: 90,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'John Cena',
      graphData: {
        data1: 30,
        data2: 69,
        total: 99,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Undertaker',
      graphData: {
        data1: 34,
        data2: 66,
        total: 100,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Starc',
      graphData: {
        data1: 34,
        data2: 44,
        total: 78,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Javed Akhtar',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Arwind Kejrwal',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
        percentage: '%'
      }
    },
    {
      tin: '11-12358967',
      groupName: 'Mayank Agarwal',
      graphData: {
        data1: 38,
        data2: 64,
        total: 102,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Bahubali',
      graphData: {
        data1: 45,
        data2: 45,
        total: 900,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Juhi Chawla',
      graphData: {
        data1: 30,
        data2: 69,
        total: 199,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Darling Clinton',
      graphData: {
        data1: 34,
        data2: 66,
        total: 509,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Hero Honda',
      graphData: {
        data1: 34,
        data2: 44,
        total: 878,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Shoib Malik',
      graphData: {
        data1: 20,
        data2: 66,
        total: 496,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Bill Clinton',
      graphData: {
        data1: 45,
        data2: 45,
        total: 909,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Ivanka Trump',
      graphData: {
        data1: 30,
        data2: 69,
        total: 1099,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Inder is Genious',
      graphData: {
        data1: 34,
        data2: 66,
        total: 500,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Aashiki Kapoor',
      graphData: {
        data1: 134,
        data2: 144,
        total: 478,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Boom Boom Shahid Afridi',
      graphData: {
        data1: 20,
        data2: 66,
        total: 876,
        percentage: '%'
      }
    },
    {
      tin: '22-12358967',
      groupName: 'Ranbir Kapoor',
      graphData: {
        data1: 45,
        data2: 45,
        total: 909,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Kareena baby',
      graphData: {
        data1: 30,
        data2: 69,
        total: 999,
        percentage: '%'
      }
    },
    {
      tin: '56-12358967',
      groupName: 'Darling Bebo',
      graphData: {
        data1: 34,
        data2: 66,
        total: 70,
        percentage: '%'
      }
    },
    {
      tin: '88-12358967',
      groupName: 'Karishma Darling',
      graphData: {
        data1: 34,
        data2: 44,
        total: 87,
        percentage: '%'
      }
    },
    {
      tin: '66-14558967',
      groupName: 'Mahummad Afridi',
      graphData: {
        data1: 20,
        data2: 66,
        total: 86,
        percentage: '%'
      }
    }
  ]
};
