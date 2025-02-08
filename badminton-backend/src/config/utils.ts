import { Model, Document } from 'mongoose';
import aqp from 'api-query-params';

export interface FindAllParams<T extends Document> {
  query?: string;
  current?: number;
  pageSize?: number;
  model: Model<T>;
  sort?: Record<string, number>;
}

export const findAll = async <T extends Document>({
  query = '',
  current = 1,
  pageSize = 10,
  model,
  sort = {},
}: FindAllParams<T>) => {
  const { filter, sort: parsedSort } = aqp(query);

  if (filter.current) delete filter.current;
  if (filter.pageSize) delete filter.pageSize;

  const totalItems = await model.countDocuments(filter).exec();
  const totalPages = Math.ceil(totalItems / pageSize);
  const skip = (current - 1) * pageSize;

  const hasPrevious = current > 1;
  const hasNext = current < totalPages;

  const normalizedSort: Record<string, 1 | -1> = Object.fromEntries(
    Object.entries({ ...parsedSort, ...sort }).map(([key, value]) => [
      key,
      value === 1 || value === -1 ? value : 1,
    ]),
  ) as Record<string, 1 | -1>;

  const results = await model
    .find(filter)
    .limit(pageSize)
    .skip(skip)
    .sort(normalizedSort)
    .exec();

  return {
    meta: {
      current,
      pageSize,
      pages: totalPages,
      total: totalItems,
      previous: hasPrevious,
      next: hasNext,
    },
    results,
  };
};

export async function isPropertyExist(
  model: Model<any>,
  propertyName: string,
  value: string,
): Promise<boolean> {
  const query = { [propertyName]: value };
  const exists = await model.exists(query);
  return exists ? true : false;
}
