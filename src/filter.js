import JSZip from 'jszip';
import { parse } from 'node-html-parser';
import terms from './medicalTerms';

const takeoutNameRe = (name) => {
  const r = /takeout-20[1-2]\d[0-1]\d[0-3]\dT[0-2]\d[0-6]\d[0-6]\dZ-\d{3}\.zip/;
  return r.test(name);
}

const zipNameRe = (name) => {
  const r = /\.zip/;
  return r.test(name);
}

const extractWordNGrams = (query) => {
  const words = query.toLowerCase()
    .replaceAll(/[()/\-+:;,.]/g, ' ')
    .replaceAll(/  */g, ' ')
    .split(' ');
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

const isDateWithinTwoYearsBeforePresentation = (date, presentationDate) => {
  const twoYearsBeforePresentation = new Date().setFullYear(
    presentationDate.getFullYear() - 2
  );
  return date >= twoYearsBeforePresentation && date <= presentationDate;
}

const filterQueriesFromJson = (jsonString, presentationDate, namesToFilter) => {
  const nameTokens = namesToFilter.replaceAll(/  */g, ' ').split(' ');
  return JSON.parse(jsonString)
    .filter((item) => {
      return isDateWithinTwoYearsBeforePresentation(
        Date.parse(item.time), presentationDate
      )
    }).filter((item) => {
      return item.title.startsWith('Searched for ')
    }).map((item) => {
      for (let token of nameTokens) {
        const regexp = new RegExp(token, 'ig');
        item.title = item.title.replaceAll(regexp, '');
      }
      return item;
    }).map((item) => {
      return {query: item.title.replace('Searched for ', ''), date: item.time}
    }).filter((item) => {
      return binaryContainsTerm(terms, item.query);
    });
};

const filterQueriesFromHtml = (content, presentationDate, namesToFilter) => {
  const nameTokens = namesToFilter.replaceAll(/  */g, ' ').split(' ');
  const doc = parse(content);
  const searches = doc.querySelectorAll(
    'div.content-cell.mdl-cell.mdl-cell--6-col.mdl-typography--body-1 a'
  );
  // const logFirstChildNodeUndefined = [...searches].find((item) => {
  //   const {childNodes} = item.parentNode;
  //   return childNodes[3] === undefined;
  // });
  // console.log(logFirstChildNodeUndefined);
  return [...searches].filter((item) => {
    const {childNodes} = item.parentNode;
    return childNodes[0] !== undefined && childNodes[1] !== undefined && childNodes[3] !== undefined;
  }).map((item) => {
      return {
        type: item.parentNode.childNodes[0].textContent,
        query: item.parentNode.childNodes[1].textContent,
        date: item.parentNode.childNodes[3].textContent
      };
    }).filter((item) => {
      return isDateWithinTwoYearsBeforePresentation(
        Date.parse(item.date),
        presentationDate
      );
    }).filter((item) => {
      return item.type.charAt(0) === 'S';
    }).map((item) => {
      return {
        query: item.query,
        date: item.date
      }
    }).filter((item) => {
      return binaryContainsTerm(terms, item.query);
    });
};

const readZipContent = async (file) => {
  const jszip = await JSZip.loadAsync(file);
  const zipobj = await jszip.file(
    /Takeout\/My Activity\/Search\/My ?Activity\.(html|json)/
  );
  return zipobj[0];
};

export const filterQueries = (data, workerCallback) => {
  const {file, presentationDate, namesToFilter} = data;

  if (file.type === 'application/json') {
    const reader = new FileReader();
    reader.onload = () => {
      const filteredQueries = filterQueriesFromJson(
        reader.result, presentationDate, namesToFilter
      );
      workerCallback(filteredQueries);
    }
    reader.readAsText(file);
  } else if (file.type === 'text/html') {
    const reader = new FileReader();
    reader.onload = () => {
      const filteredQueries = filterQueriesFromHtml(
        reader.result, presentationDate, namesToFilter
      );
      workerCallback(filteredQueries);
    }
    reader.readAsText(file);
  } else if (file.type === 'application/zip') {
    const isZipExtension = zipNameRe(file.name);
    const isValidTakeoutName = takeoutNameRe(file.name);
    if (isZipExtension || isValidTakeoutName) {
      readZipContent(file).then((object) => {
        const fileName = object.name;
        const content = object.async("string");
        let filteredQueries = [];
        if (fileName.endsWith('html')) {
          content.then((data) => {
            const filteredQueries = filterQueriesFromHtml(
              data, presentationDate, namesToFilter
            );
            workerCallback(filteredQueries);
          });
        } else if (fileName.endsWith('json')) {
          content.then((data) => {
            const filteredQueries = filterQueriesFromJson(
              data, presentationDate, namesToFilter
            );
            workerCallback(filteredQueries);
          });
        }
      });
    }
  } else {
    workerCallback([]);
  }
}
