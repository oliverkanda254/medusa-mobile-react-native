const utils = {
  areEqualObjects: function (o1?: Record<string, any>, o2?: Record<string, any>) {
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
};

export default utils;
