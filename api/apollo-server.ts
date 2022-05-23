import { ApolloServer } from 'apollo-server-express'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { join } from 'path'
import { Resolvers } from '@/types/generated/graphql'
import { ApolloContext } from '@/types/apollo'
import { getUser } from './utils'
import Query from './queries/index'
import Mutation from './mutations/index'

// スキーマの定義
const schema = loadSchemaSync(join(__dirname, '../schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
})

// リゾルバーの定義 (型のサポートを受けれる)
const resolvers: Resolvers = {
  Query: Query,
  // @ts-ignore
  Mutation: Mutation,
}

// サーバーの起動
const server = new ApolloServer({
  context: async (req) => {
    const user = await getUser(req)
    return { ...req, user } as ApolloContext
  },
  typeDefs: schema,
  resolvers,
})

server.start()

export default server
