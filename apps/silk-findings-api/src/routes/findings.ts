import express from 'express'

import { getFindings } from '../models/findings'

const findingsRouter = express.Router()

findingsRouter.get('/', async (req, res) => {
  try {
    const findings = await getFindings()
    res.status(200).json(findings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: { message: "Error connecting to database." } })
  }
})

export default findingsRouter
