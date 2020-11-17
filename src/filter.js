import JSZip from 'jszip';
import terms from './medicalTerms';

const takeoutNameRe = (name) => {
  const r = /takeout-20[1-2]\d[0-1]\d[0-3]\dT[0-2]\d[0-6]\d[0-6]\dZ-\d{3}\.zip/;
  return r.test(name);
}

const extractWordNGrams = (query) => {
  const words = query.toLowerCase().split(' ');
  if (words.length === 1) {
    return words;
  }
  // contains the n in n-gram where n > 1
  const nsize = Array.from(Array(words.length - 1).keys(), k => k + 2);

  // insert 1-grams at the beginning of array
  const queryAsNGrams = words.slice();

  // start looping over n where n > 1
  for (let n of nsize) {
    for (let i = 0; i <= words.length - n; i++) {
      const ngram = words.slice(i, i+n).join(' ');
      queryAsNGrams.push(ngram);
    }
  }
  return queryAsNGrams;
}

const binarySearch = (word) => {
  let startIdx = 0;
  let endIdx = terms.length - 1;
  let isFound = false;

  while (isFound === false && startIdx <= endIdx) {
    const middle = Math.floor((startIdx + endIdx)/2);
    const compared = word.localeCompare(terms[middle]);

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
  const ngrams = extractWordNGrams(query);
  return ngrams.some((word) => binarySearch(word));
}

const filterQueriesFromJson = (jsonString, presentationDate) => {
  const twoYearsBeforePresentation = new Date().setFullYear(
    presentationDate.getFullYear() - 2
  );
  return JSON.parse(jsonString)
    .filter((item) => {
      return Date.parse(item.time) >= twoYearsBeforePresentation
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

export const filterQueries = (data, workerCallback) => {
  const {file, presentationDate} = data;

  if (file.type === 'application/json') {
    const reader = new FileReader();
    reader.onload = () => {
      const filteredQueries = filterQueriesFromJson(
        reader.result, presentationDate
      );
      workerCallback(filteredQueries);
    }
    reader.readAsText(file);
  } else if (file.type === 'application/zip') {
    const isValidTakeoutName = takeoutNameRe(file.name);
    if (isValidTakeoutName) {
      readZipContent(file).then((content) => {
        const filteredQueries = filterQueriesFromJson(
          content, presentationDate
        );
        workerCallback(filteredQueries);
      });
    }
  } else {
    workerCallback([]);
  }
}
