export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginationResult<T> {
  items: T[]
  pagination: {
    total_items: number
    total_pages: number
    current_page: number
    limit: number
  }
}

export const getPaginationData = (page: number, limit: number) => {
  const offset = (page - 1) * limit
  return { limit, offset }
}

export const formatPaginationResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginationResult<T> => {
  return {
    items: data,
    pagination: {
      total_items: total,
      total_pages: Math.ceil(total / limit),
      current_page: page,
      limit: limit,
    },
  }
}
