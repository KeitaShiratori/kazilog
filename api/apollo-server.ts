import { ApolloServer } from 'apollo-server-express'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import { join } from 'path'
import { Resolvers } from '@/types/generated/graphql'
import { ApolloContext } from '@/types/apollo'
import { getUser } from './utils'
import { db } from './firebase'


// スキーマの定義
const schema = loadSchemaSync(join(__dirname, '../schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
})

// リゾルバーの定義 (型のサポートを受けれる)
const resolvers: Resolvers = {
  Query: {
    books: async (_parent, _args, _context) => {
      const snapshot = await db
        .collection("books")
        .orderBy("title")
        .limit(10)
        .get();
      return snapshot.docs.map(doc => {
        return doc.data();
      });
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
  resolvers
})

// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`)
// })

server.start()

export default server