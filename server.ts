import dotenv from 'dotenv'
import app from './src/app'

dotenv.config()

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`)
})
