export interface Experience {
  id?: number
  company: string
  role: string
  description?: string
  location?: string
  start_date: string | Date
  end_date?: string | Date | null
  created_at?: Date
}
