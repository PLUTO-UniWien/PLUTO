import { NextApiRequest, NextApiResponse } from 'next'
import initCors from '@/modules/cors/cors.utils'
import { connectToDatabase } from '@/modules/mongo/mongo.utils'
import { requireBasicAuth } from '@/modules/auth/auth.utils'

// Highly prototypical code, as soon as the project is migrated to a monorepo setup with shared types, this will be refactored

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await initCors(req, res)
  // const authSucceeded = requireBasicAuth(req, res);
  // (!authSucceeded) return;
  if (req.method === 'POST') {
    const data = req.body
    // Actual type schema check should happen here, should be in sync with the frontend
    if (!data) {
      res.status(400).json({ message: 'No data provided' })
      return
    }
    // Utility functions, repo layer missing
    const serverMetadata = {
      createdAt: new Date(),
      questionnaireVersion: 'v1',
      env: process.env.NODE_ENV,
      host: req.headers.host,
    }
    const document = { ...data, serverMetadata }
    const db = await connectToDatabase()
    const collection = db.collection('response')
    const result = await collection.insertOne(document)
    res.status(200).json(result)
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end('Method Not Allowed')
  }
}
