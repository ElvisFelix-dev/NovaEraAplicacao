import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import userRoutes from './routes/userRoutes.js'
import propertyRoutes from './routes/propertyRoutes.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('📊 Connected to db'))
  .catch((err) => console.error('Error connected db:', err.message))

app.use('/api/users', userRoutes)
app.use('/api/properties', propertyRoutes)

app.get('/test-server', (req, res) => {
  res.send('Nova Era Imobiliaria Inteligente! ✅')
})

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`💻 Server running ${PORT}`)
})
