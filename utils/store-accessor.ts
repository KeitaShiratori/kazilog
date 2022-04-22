/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Book from '~/store/book'
import Auth from '~/store/auth'

let BookStore: Book
let AuthStore: Auth
function initialiseStores(store: Store<any>): void {
  BookStore = getModule(Book, store)
  AuthStore = getModule(Auth, store)
}

export { initialiseStores, BookStore, AuthStore }
