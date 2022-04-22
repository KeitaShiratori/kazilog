import * as firebaseAdmin from 'firebase-admin'
import { initializeApp, applicationDefault } from 'firebase-admin/app'

import { AuthError } from './utils'
import { ApolloContext } from '@/types/apollo'

require('dotenv').config()
console.log(process.env)
console.log(__dirname)

// var serviceAccount = require(`${process.env.FIREBASE_CREDENTIAL}`);
var serviceAccount = require(`${process.env.GOOGLE_APPLICATION_CREDENTIALS}`)

const admin = firebaseAdmin.initializeApp(
  {
    // credential: firebaseAdmin.credential.cert(serviceAccount),
    credential: applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  },
  'apollo'
)

const db = admin.firestore()
const defaultAuth = admin.auth()
// const admin = firebaseAdmin.initializeApp(
//   {
//     credential: applicationDefault(),
//     databaseURL: process.env.FIREBASE_DATABASE_URL,
//   },
//   'server'
// );
console.log(admin)
// const admin = initializeApp({
//   credential: applicationDefault(),
//   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
// });

//returns cookie token
const createUserSessionToken = async (args: any, ctx: ApolloContext) => {
  // Get the ID token.
  const idToken = args.idToken.toString()

  // Only process if the user just signed in in the last 5 minutes.
  // To guard against ID token theft, reject and require re-authentication.
  const decodedIdToken = await admin.auth().verifyIdToken(idToken)
  if (!(new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60))
    throw new AuthError({ message: 'Recent sign in required!' })

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000

  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  const token = await admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .catch((error) => {
      console.log(error)
      throw new AuthError({
        message: 'User Session Token Creation Error',
        stack: error,
      })
    })
  if (token) return token
  else throw new AuthError({ message: 'User Session Token Creation Error' })
}

//Returns decoded User Claims
const verifyUserSessionToken = async (token: string) => {
  //Verify session cookies tokens with firebase admin.
  //This is a low overhead operation.
  const user = await admin
    .auth()
    .verifySessionCookie(token, true /** checkRevoked */)

  if (user.id) return user
  else if (user.uid) {
    const { customClaims } = await getUserRecord(user.uid)
    return customClaims
  } else
    throw new AuthError({ message: 'User Session Token Verification Error' })
}

//Sets properties into firebase user
const setUserClaims = (uid: string, data: object | null) =>
  admin.auth().setCustomUserClaims(uid, data)

const getUserRecord = (uid: string) => admin.auth().getUser(uid)

const verifyIdToken = (idToken: string) => admin.auth().verifyIdToken(idToken)

export {
  createUserSessionToken,
  verifyUserSessionToken,
  setUserClaims,
  getUserRecord,
  verifyIdToken,
  db,
}
