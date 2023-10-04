import express from 'express'

import cors from 'cors'
import compression from 'compression'
import mongoose from 'mongoose'

import 'dotenv/config'

import findingsRouter from './routes/findings'

const port = process.env.NX_PORT || 3333

async function connectToMongo() {
  const mongoPath = `${process.env.NX_ATLAS_PROTOCOL}://${process.env.NX_ATLAS_USER}:${process.env.NX_ATLAS_PWD}@${process.env.NX_ATLAS_HOST}/silk-findings?retryWrites=true&w=majority`
  await mongoose.connect(mongoPath)
  console.log('Atlas connected')
}

connectToMongo().catch((error) => console.error(error))

const app = express()
app.use(cors())
app.use(compression())
app.use('/api/findings', findingsRouter)

const server = app.listen(port, () => {
  console.log(`API listening at http://localhost:${port} 📡`)
})
server.on('error', console.error)
