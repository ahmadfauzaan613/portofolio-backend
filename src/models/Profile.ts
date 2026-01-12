export interface ProfileLink {
  id?: number
  profile_id?: number
  type: 'whatsapp' | 'email' | 'linkedin' | 'resume'
  value: string
}

export interface Profile {
  id?: number
  role: string
  about: string
  links: ProfileLink[]
  created_at?: Date
}
