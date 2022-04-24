import { UserRecord } from 'firebase-admin/lib/auth/user-record'

export interface ApolloContext {
  req: any
  user: UserRecord
}
