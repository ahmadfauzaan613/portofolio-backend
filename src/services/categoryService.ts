import * as repo from '../repository/categoryRepository'

export const getCategoryList = async () => {
  return await repo.findAll()
}

export const saveCategory = async (name: string) => {
  return await repo.create(name)
}

export const updateCategory = async (id: number, name: string) => {
  const existing = await repo.findById(id)
  if (!existing) throw new Error('Category not found')

  return await repo.update(id, name)
}

export const deleteCategory = async (id: number) => {
  const existing = await repo.findById(id)
  if (!existing) throw new Error('Category not found')

  return await repo.remove(id)
}
