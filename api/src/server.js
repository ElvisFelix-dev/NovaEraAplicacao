import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('📊 Connected to db'))
  .catch((err) => console.error('Error connected db:', err.message))

app.use('/api/users', userRoutes)

app.get('/test-server', (req, res) => {
  res.send('Nova Era Imobiliaria Inteligente! ✅')
})

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`💻 Server running ${PORT}`)
})
