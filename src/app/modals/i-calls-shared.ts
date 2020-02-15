/*
Following is the template for the data we are getting in Calls component page from shared file for
both the donuts
*/

export interface ICallsShared {
  category: string;
  type: string;
  status: number;
  title: string;
  MetricID: string;
  data: Object;
  toggle: boolean;
  besideData: any;
  timeperiod: string;
}
