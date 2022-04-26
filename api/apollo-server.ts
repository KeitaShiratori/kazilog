import { ApolloServer } from 'apollo-server-express'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import { join } from 'path'
import {
  Category,
  Family,
  Kazi,
  Repeat,
  Resolvers,
  Timeline,
  User,
  DispKazi,
} from '@/types/generated/graphql'
import { ApolloContext } from '@/types/apollo'
import { getUser } from './utils'
import { db } from './firebase'
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
} from 'firebase/firestore'

// スキーマの定義
const schema = loadSchemaSync(join(__dirname, '../schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
})

// リゾルバーの定義 (型のサポートを受けれる)
const resolvers: Resolvers = {
  Query: {
    // books: async (_parent: any, _args: any, _context: any) => {
    //   const snapshot = await db
    //     .collection('books')
    //     .orderBy('title')
    //     .limit(10)
    //     .get()
    //   return snapshot.docs.map((doc) => {
    //     return doc.data()
    //   })
    // },
    family: async (_parent: any, _args: any, _context: any) => {
      const uid = _context?.user?.uid
      const doc = await db.collection('users').doc(uid).get()

      const user = doc.data() as User
      const familyRef = user.family as DocumentData
      const family = (await familyRef.get()).data()
      const userNames = await Promise.all(
        family.users.map(async (docRef: DocumentData) => {
          return { name: (await docRef.get()).data().name }
        })
      )
      family.users = userNames
      family.id = familyRef.id
      return family
    },
    timelinesDoneToday: async (_parent: any, _args: any, _context: any) => {
      const uid = _context?.user?.uid
      const doc = await db.collection('users').doc(uid).get()

      const user = doc.data() as User
      const familyRef = user.family as DocumentData

      // const { familyId, datetime } = _args
      const familyId = familyRef.id

      const timelineRef = await db
        .collection('timeline')
        .where('familyId', '==', familyId)
        .get()

      return timelineRef.docs.reduce(async (ret: any, doc) => {
        const kazi = (await (doc.data().kazi as DocumentData).get()).data()
        ret.push({
          id: doc.id,
          kazi: {
            id: doc.data().kazi.id,
            category: {
              id: kazi.categoryId,
              name: (await kazi.category.get()).data().name,
            },
            name: kazi.name,
            point: kazi.point,
            repeat: kazi.repeat,
          },
          user: (await doc.data().user.get()).data().name,
          memo: doc.data().memo,
          doneAt: doc.data().doneAt,
        })
        return ret
      }, [] as Timeline[])
    },
    kazisRemainedToday: async (_parent: any, _args: any, _context: any) => {
      const uid = _context?.user?.uid
      const doc = await db.collection('users').doc(uid).get()

      const user = doc.data() as User
      const familyRef = user.family as DocumentData

      // const { familyId, datetime } = _args
      const familyId = familyRef.id

      const kaziRef = await db
        .collection('kazi')
        .where('familyId', '==', familyId)
        .get()

      return kaziRef.docs.map(async (doc) => ({
        id: doc.id,
        category: {
          id: doc.data().categoryId,
          name: (await doc.data().category.get()).data().name,
        },
        name: doc.data().name,
        point: doc.data().point,
        repeat: doc.data().repeat,
      }))
    },
    kazisToday: async (_parent: any, _args: any, _context: any) => {
      const uid = _context?.user?.uid
      const doc = await db.collection('users').doc(uid).get()

      const user = doc.data() as User
      const familyRef = user.family as DocumentData

      // const { familyId, datetime } = _args
      const familyId = familyRef.id

      const timelineRef = await db
        .collection('timeline')
        .where('familyId', '==', familyId)
        .get()

      const kaziRef = await db
        .collection('kazi')
        .where('familyId', '==', familyId)
        .get()

      const timelines = await timelineRef.docs.reduce(async (ret: any, doc) => {
        const kazi = (await (doc.data().kazi as DocumentData).get()).data()
        ret.push({
          id: doc.id,
          kazi: {
            id: doc.data().kazi.id,
            category: {
              id: kazi.categoryId,
              name: (await kazi.category.get()).data().name,
            },
            name: kazi.name,
            point: kazi.point,
            repeat: kazi.repeat,
          },
          user: {
            uid: doc.data().user.id,
            name: (await doc.data().user.get()).data().name
          },
          memo: doc.data().memo,
          doneAt: doc.data().doneAt,
        })
        return ret
      }, [] as Timeline[])

      const kazis = await Promise.all(
        kaziRef.docs.map(async (doc) => ({
          id: doc.id,
          category: {
            id: doc.data().categoryId,
            name: (await doc.data().category.get()).data().name,
          },
          name: doc.data().name,
          point: doc.data().point,
          repeat: {
            type: doc.data().repeat.type,
            activatedAt: doc.data().repeat.activatedAt.toDate()
          }
        })) as DispKazi[]
      )

      for (const kazi of kazis) {
        const timeline = timelines.find((t: Timeline) => t.kazi?.id === kazi.id)
        if (!timeline) continue
        kazi.user = timeline.user
        kazi.doneAt = timeline.doneAt.toDate()
        kazi.memo = timeline.memo
      }

      return kazis
    },
  },
}

const schemaWithResolvers = addResolversToSchema({ schema, resolvers })

// サーバーの起動
const server = new ApolloServer({
  // schema: schemaWithResolvers,
  context: async (req) => {
    const user = await getUser(req)
    return { ...req, user } as ApolloContext
  },
  // debug: false, // エラーレスポンスにスタックトレースを含ませない、開発環境ではtrueにした方が分析が捗りそう
  typeDefs: schema,
  resolvers,
})

// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`)
// })

server.start()

export default server
