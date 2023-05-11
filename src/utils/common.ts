export const transformNumberFormat = (followers: number) => {
  if (followers < 1000) return followers;
  if (followers < 1000000) return `${(followers / 1000).toFixed(1)}k`;
  return `${(followers / 1000000).toFixed(1)}m`;
};
