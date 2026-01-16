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

  return formatPaginationResponse(data, total, page, limit)
}

export const updateExperience = async (id: number, data: any) => {
  const existing = await experienceRepo.findById(id)
  if (!existing) throw new Error('Experience not found')

  return await experienceRepo.update(id, data)
}

export const deleteExperience = async (id: number) => {
  const existing = await experienceRepo.findById(id)
  if (!existing) throw new Error('Experience not found')

  return await experienceRepo.remove(id)
}

export const getExperienceById = async (id: number) => {
  const data = await experienceRepo.findById(id)
  if (!data) throw new Error('Experience not found')
  return data
}
