import NextCors from 'nextjs-cors'
import { NextApiRequest, NextApiResponse } from 'next'

const DEV_ORIGINS = ['http://localhost:8080/']
const PROD_ORIGINS = [
  'https://pluto-survey.vercel.app/',
  'https://pluto-survey-git-main-peter-gy.vercel.app/',
  'http://pluto.vda.univie.ac.at/',
  'https://pluto.vda.univie.ac.at/',
]

export default async function initCors<T>(
  req: NextApiRequest,
  res: NextApiResponse<T>
) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: process.env.NODE_ENV === 'development' ? DEV_ORIGINS : PROD_ORIGINS,
    optionsSuccessStatus: 200,
  })
}
