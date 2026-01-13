import * as repo from '../repository/categoryRepository'

export const getCategoryList = async () => {
  return await repo.findAll()
}

export const saveCategory = async (name: string) => {
  return await repo.create(name)
}
