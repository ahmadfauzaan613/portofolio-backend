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
