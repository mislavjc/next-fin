export const mapAndReduce = (entries) => {
  console.log('...mapping entries')
  const mappedEntries = entries
    .map((entry) => entry.inputs.map((input) => input?.value))
    .flat();
  console.log([...new Set(mappedEntries)]);
  return [...new Set(mappedEntries)];
};
