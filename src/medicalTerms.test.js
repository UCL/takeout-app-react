import terms from './medicalTerms';

it('terms array to contain X items', () => {
  expect(terms).toHaveLength(68380);
});
