import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as userRepo from '../repository/userRepository'

const JWT_SECRET = process.env.JWT_SECRET as string

export const login = async (username: string, pass: string) => {
  const user = await userRepo.findByUsername(username)
  if (!user) throw new Error('User not found')

  const isMatch = await bcrypt.compare(pass, user.password)
  if (!isMatch) throw new Error('Invalid credentials')

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' })

  const { password, ...userWithoutPass } = user
  return { user: userWithoutPass, token }
}

export const changePassword = async (userId: number, oldPass: string, newPass: string) => {
  const user = await userRepo.findById(userId)
  if (!user) throw new Error('User not found')

  const isMatch = await bcrypt.compare(oldPass, user.password)
  if (!isMatch) throw new Error('Old password incorrect')

  const salt = await bcrypt.genSalt(10)
  const hashedPass = await bcrypt.hash(newPass, salt)

  return await userRepo.updatePassword(userId, hashedPass)
}

export const getMe = async (userId: number) => {
  const user = await userRepo.findById(userId)
  if (!user) throw new Error('User not found')

  const { password, ...userWithoutPass } = user
  return userWithoutPass
}
