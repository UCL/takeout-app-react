import {filterQueries} from './filter';

const response = {
  success: false,
  result: []
};

onmessage = (e) => {
  if (!e) return;

  const postCallback = (filtered) => {
    // response.success = undefined !== filtered && filtered.length > 0;
    response.success = undefined !== filtered;

    if (undefined !== filtered || filtered.length > 0) {
      response.result = filtered;
    }    
    postMessage(response);
  }

  filterQueries(e.data, postCallback);

}
