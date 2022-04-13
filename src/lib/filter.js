export const mapAndReduce = (entries) => {
  const mappedEntries = entries
    .map((entry) => entry.inputs.map((input) => input?.value))
    .flat();
  const set = [...new Set(mappedEntries)];
  return set.filter((entry) => entry !== '' || entry !== undefined || entry !== null);
};
