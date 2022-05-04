it('processes a valid html', () => {
  const searches = [
    {
      parentNode: {
        childNodes: [
          {textContent: "bla"},
          {textContent: "ble"},
          {textContent: "bli"},
          {textContent: "blo"}
        ]
      }
    }
  ]
  const result = [...searches].filter((item) => {
    const {childNodes} = item.parentNode;
    return childNodes[0] !== undefined && childNodes[1] !== undefined && childNodes[3] !== undefined;
  }).map((item) => {
      return {
        type: item.parentNode.childNodes[0].textContent,
        query: item.parentNode.childNodes[1].textContent,
        date: item.parentNode.childNodes[3].textContent
      };
    });
  const expected = [ { type: 'bla', query: 'ble', date: 'blo' } ];
  expect(result).toEqual(expected);
});

it('processes an invalid html', () => {
  const searches = [
    {
      parentNode: {
        childNodes: [
          {textContent: "bla"},
          {textContent: "ble"},
          {textContent: "bli"},
        ]
      }
    },
    {
      parentNode: {
        childNodes: [
          {textContent: "bla2"},
          {textContent: "ble2"},
          {textContent: "bli2"},
        ]
      }
    }
  ]
  const result = [...searches].filter((item) => {
    const {childNodes} = item.parentNode;
    return childNodes !== undefined && childNodes[0] !== undefined && childNodes[1] !== undefined && childNodes[3] !== undefined;
  }).map((item) => {
      return {
        type: item.parentNode.childNodes[0].textContent,
        query: item.parentNode.childNodes[1].textContent,
        date: item.parentNode.childNodes[3].textContent
      };
    });
  const test = [...searches].find((item) => {
    const {childNodes} = item.parentNode;
    return childNodes[3] === undefined;
  })
  expect(result).toHaveLength(0);
});

it('filters out non alpha characters', () => {
  const input = "a[b(c)d/e\"f-g+h:i;j,k.lm\"n]";
  const result = input.toLowerCase().replaceAll(/[\[\]()/\\\-+:;,."]/g, '');
  const expected = "abcdefghijklmn";
  expect(result).toEqual(expected);
});
