import { Experience } from '../models/Experience'
import * as experienceRepo from '../repository/experienceRepository'
import { formatPaginationResponse, getPaginationData } from '../utils/paginationHelper'

export const createExperience = async (data: Experience) => {
  if (data.end_date && new Date(data.end_date) < new Date(data.start_date)) {
    throw new Error('End date cannot be earlier than start date')
  }
  return await experienceRepo.create(data)
}

export const getAllExperiences = async (page: number, limit: number) => {
  const { limit: l, offset } = getPaginationData(page, limit)

  const { data, total } = await experienceRepo.findAll(l, offset)

  // Tinggal panggil formatter-nya
  return formatPaginationResponse(data, total, page, limit)
}
