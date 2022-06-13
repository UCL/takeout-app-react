import {filterQueries} from './filter';

const response = {
  success: false,
  result: [],
  totalUnfiltered: 0,
  firstQueryDate: undefined
};

onmessage = (e) => {
  if (!e) return;

  const postCallback = (filtered, totalUnfiltered, firstQueryDate) => {
    // response.success = undefined !== filtered && filtered.length > 0;
    response.success = undefined !== filtered;

    if (undefined !== filtered || filtered.length > 0) {
      response.result = filtered;
      response.totalUnfiltered = totalUnfiltered,
      response.firstQueryDate = firstQueryDate
    }
    postMessage(response);
  }

  filterQueries(e.data, postCallback);

}
