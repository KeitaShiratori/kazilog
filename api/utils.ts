import { verifyIdToken, getUserRecord } from './firebase'

export async function getUser(ctx: any) {
  const Authorization = ctx.req.headers.authorization
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    // const { id, admin } = (await verifyUserSessionToken(token)) as Auth
    const decodedIdToken = await verifyIdToken(token)
    const user = await getUserRecord(decodedIdToken.uid)

    return user
  }
  return null
}

export class AuthError extends Error {
  constructor(
    error: { message: string; stack?: any } = { message: 'Not authorized' },
  ) {
    super(error.message)
  }
}
