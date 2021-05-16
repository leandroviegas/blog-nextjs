import { NextApiRequest, NextApiResponse } from 'next'
import Cookies from 'cookies'
import HandleAuth from '../../services/auth'


async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res)

  switch (req.method) {
    case "DELETE":
      cookies.set('auth')
      break;
  }
  let UA = await HandleAuth(cookies.get("auth"))
  UA?.username ?
    res.status(200).json({ username: UA?.username }) :
    res.status(200).json({})
}

export default handler