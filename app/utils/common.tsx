import { BaseRegionCountry } from '@medusajs/types/dist/http/region/common';

const utils = {
  areEqualObjects: function (
    o1?: Record<string, any>,
    o2?: Record<string, any>,
  ) {
    if (!o1 || !o2) {
      return false;
    }
    for (var p in o1) {
      if (o1.hasOwnProperty(p)) {
        if (o1[p] !== o2[p]) {
          return false;
        }
      }
    }
    for (var p in o2) {
      if (o2.hasOwnProperty(p)) {
        if (o1[p] !== o2[p]) {
          return false;
        }
      }
    }
    return true;
  },
  getCountryName: (
    countryCode?: string,
    countries?: BaseRegionCountry[],
  ) => {
    if (!countryCode || !countries) {
      return '';
    }
    const country = countries.find(c => c.iso_2 === countryCode);
    return country?.display_name || countryCode.toUpperCase();
  },
};

export default utils;
