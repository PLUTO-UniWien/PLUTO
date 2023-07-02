/**
 * Group an array of items by a key.
 *
 * @template T - The type of the items in the list.
 * @template K - The type of the keys.
 *
 * @param {T[]} list - The list of items to group.
 * @param {function(T): K} getKey - A function that returns the key to group by.
 * @returns {Record<K, T[]>} - The grouped items.
 */
export function groupBy<T, K extends keyof never>(
  list: T[],
  getKey: (item: T) => K
) {
  return list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);
}
