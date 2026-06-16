import * as logRepo from '../repository/logRepository'
import { formatPaginationResponse, getPaginationData } from '../utils/paginationHelper'

export const storeLog = async (data: any) => {
  return await logRepo.create(data)
}

export const getAllLogs = async (page: number, limit: number) => {
  const { limit: l, offset } = getPaginationData(page, limit)
  const { data, total } = await logRepo.findAll(l, offset)

  return formatPaginationResponse(data, total, page, limit)
}

export const deleteAllLogs = async () => {
  return await logRepo.clearAllLogs()
}
