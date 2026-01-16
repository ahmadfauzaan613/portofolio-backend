import { Profile } from '../models/Profile'
import * as profileRepo from '../repository/profileRepository'

export const createFullProfile = async (profileData: Profile) => {
  const { role, about, links } = profileData

  if (!links || links.length === 0) {
    throw new Error('At least one link is required')
  }

  const profileId = await profileRepo.saveProfile(role, about)
  await profileRepo.saveLinks(profileId, links)

  return { id: profileId, ...profileData }
}

export const updateFullProfile = async (id: number, profileData: Profile) => {
  const { role, about, links } = profileData

  const existing = await profileRepo.findById(id)
  if (!existing) {
    throw new Error('Profile not found')
  }

  await profileRepo.updateProfile(id, role, about)

  if (links && links.length > 0) {
    await profileRepo.updateLinks(id, links)
  }

  return { id, ...profileData }
}

export const deleteProfile = async (id: number) => {
  const existing = await profileRepo.findById(id)
  if (!existing) {
    throw new Error('Profile not found')
  }

  return await profileRepo.deleteProfile(id)
}

export const getLatestProfile = async () => {
  const profile = await profileRepo.findLatest()
  if (!profile) return null

  const links = await profileRepo.findLinksByProfileId(profile.id)
  return { ...profile, links }
}
