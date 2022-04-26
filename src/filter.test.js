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
  console.log(test);
  expect(result).toHaveLength(0);
});
