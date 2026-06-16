import { Experience } from '../models/Experience'
import * as experienceRepo from '../repository/experienceRepository'
import { formatPaginationResponse, getPaginationData } from '../utils/paginationHelper'
import { NotFoundError, BadRequestError } from '../utils/exceptions'

export const createExperience = async (data: Experience) => {
  const endDate = data.end_date === '' || data.end_date === 'null' ? null : data.end_date

  if (endDate && new Date(endDate) < new Date(data.start_date)) {
    throw new BadRequestError('End date cannot be earlier than start date')
  }
  return await experienceRepo.create({
    ...data,
    end_date: endDate,
  })
}

export const getAllExperiences = async (page: number, limit: number) => {
  const { limit: l, offset } = getPaginationData(page, limit)

  const { data, total } = await experienceRepo.findAll(l, offset)

  return formatPaginationResponse(data, total, page, limit)
}

export const updateExperience = async (id: number, data: Partial<Experience>) => {
  const existing = await experienceRepo.findById(id)
  if (!existing) throw new NotFoundError('Experience not found')

  const inputEndDate = data.end_date === '' || data.end_date === 'null' ? null : data.end_date

  // Merge payload with existing experience properties to prevent violating NOT NULL constraints
  const updatedData: Partial<Experience> = {
    company: data.company !== undefined ? data.company : existing.company,
    role: data.role !== undefined ? data.role : existing.role,
    description: data.description !== undefined ? data.description : existing.description,
    location: data.location !== undefined ? data.location : existing.location,
    start_date: data.start_date !== undefined ? data.start_date : existing.start_date,
    end_date: data.end_date !== undefined ? inputEndDate : existing.end_date,
  }

  // Validate dates if they are present
  if (updatedData.end_date && updatedData.start_date && new Date(updatedData.end_date) < new Date(updatedData.start_date)) {
    throw new BadRequestError('End date cannot be earlier than start date')
  }

  return await experienceRepo.update(id, updatedData)
}

export const deleteExperience = async (id: number) => {
  const existing = await experienceRepo.findById(id)
  if (!existing) throw new NotFoundError('Experience not found')

  return await experienceRepo.remove(id)
}

export const getExperienceById = async (id: number) => {
  const data = await experienceRepo.findById(id)
  if (!data) throw new NotFoundError('Experience not found')
  return data
}
