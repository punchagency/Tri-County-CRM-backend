
/**
 * Batch processor to process a list of items in batches
 * @param list - The list of items to process
 * @param processor - The processor function
 * @param fillEmpty - Whether to fill empty items with null
 * @returns The processed list
 */
export async function batchProcessor<T>(list: Array<T>, processor: (item: T, index: number) => any, fillEmpty: boolean = false) {

 if (!list.length) {
  return [];
 }

 const batchSize = Math.ceil(Math.sqrt(list.length));

 let index = 0;
 let new_results: Array<T> = [];

 while (index < list.length) {
  const batch = list.slice(index, index + batchSize);

  // process the batch
  const results = await Promise.all(batch.map(processor));

  // filter out empty items if fillEmpty is true
  const results_updated = fillEmpty ? results.filter(item => !!item) : results;

  new_results.push(...results_updated);

  index += batchSize;
 }

 return new_results;

}