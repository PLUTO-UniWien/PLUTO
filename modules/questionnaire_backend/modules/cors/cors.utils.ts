import NextCors from 'nextjs-cors'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function initCors<T>(
  req: NextApiRequest,
  res: NextApiResponse<T>
) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: [
      'http://localhost:8080/',
      'https://pluto-survey.vercel.app/',
      'https://pluto-survey-git-main-peter-gy.vercel.app/',
      'http://pluto.vda.univie.ac.at/',
      'https://pluto.vda.univie.ac.at/',
    ],
    optionsSuccessStatus: 200,
  })
}
