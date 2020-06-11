import { PageDefaultTimePeriodMap, PageTimeFrameMap, TimePeriod, FilterOption } from './filter-options';
const OptionsMap: any = {
  timeperiod: TimePeriod
};
const PageOptionsMap: any = {
  timeperiod: PageTimeFrameMap
};

const populateFilterOptions = (options: any, currentPage: string, item: string) => {
  const pageOptions = PageOptionsMap[item];

  const pageOptionsItem = pageOptions[currentPage] || pageOptions.default;
  const includeOptions = pageOptionsItem.include;
  const excludeOptions = pageOptionsItem.exclude;
  return options
    .filter((option: any) => {
      if (includeOptions.length > 0) {
        return (
          includeOptions.findIndex((element: any) => {
            return element === option.name;
          }) > -1
        );
      } else {
        return true;
      }
    })
    .filter((option: any) => {
      if (excludeOptions.length > 0) {
        return (
          excludeOptions.findIndex((element: any) => {
            return element !== option.name;
          }) > -1
        );
      } else {
        return true;
      }
    });
};

export const GetFilterOptionsByPage = (currentPage: string, item: string) => {
  const defaultFilter = PageDefaultTimePeriodMap[currentPage] || PageDefaultTimePeriodMap.default;
  const options = populateFilterOptions(OptionsMap[item], currentPage, item).map((timeFrameElement: any) => {
    timeFrameElement.default = false;
    if (defaultFilter === timeFrameElement.name) {
      timeFrameElement.default = true;
    }
    return timeFrameElement;
  });
  return options;
};

export const GetCurrentFilterOptionByPage = (currentPage: string, item: string, currentValue: any) => {
  const options: FilterOption[] = GetFilterOptionsByPage(currentPage, item);
  let selectedOption = options.find((option: FilterOption) => option.name === currentValue);
  if (!selectedOption) {
    selectedOption = options.find((option: any) => {
      return option.default;
    });
  }
  return selectedOption;
};
