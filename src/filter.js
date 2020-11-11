import JSZip from 'jszip';
import terms from './medicalTerms';

const takeoutNameRe = (name) => {
  const r = /takeout-20[1-2]\d[0-1]\d[0-3]\dT[0-2]\d[0-6]\d[0-6]\dZ-\d{3}\.zip/;
  return r.test(name);
}

const binarySearch = (word) => {
  let startIdx = 0;
  let endIdx = terms.length - 1;
  let isFound = false;

  while (isFound === false && startIdx <= endIdx) {
    const middle = Math.floor((startIdx + endIdx)/2);
    const compared = word.localeCompare(terms[middle]); // add or condition terms[middle].includes(word);

    if (compared === 0) {
      isFound = true;
    } else if (compared < 0) {
      endIdx = middle - 1;
    } else {
      startIdx = middle + 1;
    }
  }
  return isFound;
}

const binaryContainsTerm = (searchTerms, query) => {
  return query.toLowerCase().split(' ').some((word) => binarySearch(word));
}

//  const containsTerm = (searchTerms, query) => {
//    return searchTerms.some((t) => {
//      const q = ' ' + query + ' ';
//      const term = ' ' + t + ' ';
//      return q.toLowerCase().includes(term.toLowerCase());
//    })
//  }

const filterQueriesFromJson = (jsonString) => {
  return JSON.parse(jsonString)
    .filter((item) => {
      return Date.parse(item.time) >= new Date().setFullYear(new Date().getFullYear() - 2)
    }).filter((item) => {
      return item.title.startsWith('Searched for ')
    }).map((item) => {
      return {query: item.title.replace('Searched for ', ''), date: item.time}
    }).filter((item) => {
      // return containsTerm(terms, item.query);
      return binaryContainsTerm(terms, item.query);
    });
}

const readZipContent = async (file) => {
  const jszip = await JSZip.loadAsync(file);
  const zipobj = await jszip.file(
    'Takeout/My Activity/Search/MyActivity.json'
  );
  const stringContent = await zipobj.async("string");
  return stringContent;
};

export const filterQueries = (file, workerCallback) => {
  if (file.type === 'application/json') {
    const readJson = (callback) => {
      const reader = new FileReader();
      reader.onload = () => {
        return callback(reader.result);
      }
      reader.readAsText(file);
    };
    const filteredQueries = readJson((result) => filterQueriesFromJson(result));
    workerCallback(filteredQueries);
  } else if (file.type === 'application/zip') {
    const isValidTakeoutName = takeoutNameRe(file.name);
    if (isValidTakeoutName) {
      readZipContent(file).then((content) => {
        const filteredQueries = filterQueriesFromJson(content);
        workerCallback(filteredQueries);
      });
    }
  } else {
    workerCallback([]);
  }
}
