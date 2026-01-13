import dotenv from 'dotenv'
import fs from 'fs'
import multer from 'multer'
import path from 'path'

dotenv.config()

export const UPLOAD_PATH = path.resolve(process.env.UPLOAD_PATH || './uploads')

if (!fs.existsSync(UPLOAD_PATH)) {
  try {
    fs.mkdirSync(UPLOAD_PATH, { recursive: true })
    console.log(`✅ Upload directory created at: ${UPLOAD_PATH}`)
  } catch (err) {
    console.error(`❌ Failed to create directory: ${err}`)
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_PATH),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  },
})

export const upload = multer({ storage })
