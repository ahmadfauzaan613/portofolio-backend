import { Profile } from '../models/Profile'
import * as profileRepo from '../repository/profileRepository'
import { NotFoundError, BadRequestError } from '../utils/exceptions'
import { uploadFile, getFullUrl } from '../utils/s3Storage'

const resolveLinks = (links: any[]) => {
  if (!links) return []
  return links.map(link => {
    if (link.type === 'resume') {
      return { ...link, value: getFullUrl(link.value) || link.value }
    }
    return link
  })
}

export const uploadResumeFile = async (file: any) => {
  if (!file) {
    throw new BadRequestError('Resume file is required')
  }
  const key = await uploadFile(file.buffer, file.originalname, 'profiles/resumes')
  const url = getFullUrl(key)
  return { key, url }
}

export const createFullProfile = async (profileData: Profile) => {
  const { role, about, links } = profileData

  if (!links || links.length === 0) {
    throw new BadRequestError('At least one link is required')
  }

  const profileId = await profileRepo.saveProfile(role, about)
  await profileRepo.saveLinks(profileId, links)

  return { id: profileId, role, about, links: resolveLinks(links) }
}

export const updateFullProfile = async (id: number, profileData: Profile) => {
  const { role, about, links } = profileData

  const existing = await profileRepo.findById(id)
  if (!existing) {
    throw new NotFoundError('Profile not found')
  }

  // Merge values to handle optional fields or prevent setting NOT NULL fields to null/undefined
  const finalRole = role !== undefined ? role : existing.role
  const finalAbout = about !== undefined ? about : existing.about

  if (!finalRole) {
    throw new BadRequestError('Role is required')
  }
  if (!finalAbout) {
    throw new BadRequestError('About section is required')
  }

  await profileRepo.updateProfile(id, finalRole, finalAbout)

  if (links !== undefined) {
    if (links.length === 0) {
      throw new BadRequestError('At least one link is required')
    }
    await profileRepo.updateLinks(id, links)
  }

  // Retrieve fully updated profile with links
  const updatedProfile = await profileRepo.findById(id)
  const updatedLinks = await profileRepo.findLinksByProfileId(id)

  return { ...updatedProfile, links: resolveLinks(updatedLinks) }
}

export const deleteProfile = async (id: number) => {
  const existing = await profileRepo.findById(id)
  if (!existing) {
    throw new NotFoundError('Profile not found')
  }

  return await profileRepo.deleteProfile(id)
}

export const getLatestProfile = async () => {
  const profile = await profileRepo.findLatest()
  if (!profile) return null

  const links = await profileRepo.findLinksByProfileId(profile.id)
  return { ...profile, links: resolveLinks(links) }
}
