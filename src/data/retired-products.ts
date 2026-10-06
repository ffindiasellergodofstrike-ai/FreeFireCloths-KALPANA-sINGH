import retiredIds from './retired-products.json' with { type: 'json' };
const retired = new Set<number>(retiredIds);
export const isRetiredProduct = (id: number | string): boolean => retired.has(Number(id));
