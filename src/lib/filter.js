export const mapAndReduce = (entries) => {
  const mappedEntries = entries
    .map((entry) => entry.inputs.map((input) => input.value))
    .flat();
  return [...new Set(mappedEntries)];
};
