import * as logRepo from '../repository/logRepository'

export const storeLog = async (data: any) => {
  return await logRepo.create(data)
}

export const getAllLogs = async (page: number, limit: number) => {
  const offset = (page - 1) * limit
  const { data, total } = await logRepo.findAll(limit, offset)

  return {
    list: data,
    pagination: {
      totalItems: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit,
    },
  }
}

export const deleteAllLogs = async () => {
  return await logRepo.clearAllLogs()
}
