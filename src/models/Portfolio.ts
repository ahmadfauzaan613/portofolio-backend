export interface Portfolio {
  id?: number
  image_banner: string
  short_desc: string
  title: string
  description: string
  link?: string
  all_image: string[]
  logo: string[]
  category: string
}

export type PortfolioImageType = 'all_image' | 'logo'

export interface IPortfolioImage {
  id: number
  portfolio_id: number
  type: PortfolioImageType
  filename: string
  created_at: Date
}

export interface ICreatePortfolioImage {
  portfolio_id: number
  type: PortfolioImageType
  filename: string
}
