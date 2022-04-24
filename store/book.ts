// import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
// import { Book } from '~/types/store'

// @Module({
//   name: 'book',
//   stateFactory: true,
//   namespaced: true
// })

// export default class Books extends VuexModule {
//   private books: Book[] = []

//   public get getBooks() {
//     return this.books
//   }

//   public get getTodo() {
//     return (title: String) => this.books.find((book) => book.title === title)
//   }

//   public get getBookCount() {
//     return this.books.length
//   }

//   @Mutation
//   private add(book: Book) {
//     this.books.push(book)
//   }

//   @Mutation
//   private remove(title: String) {
//     this.books = this.books.filter((book) => book.title !== title)
//   }

//   @Mutation set(books: Book[]) {
//     this.books = books
//   }

//   // @Action({ rawError: true })
//   // public async fetch() {
//   //   const { data } = await $axios.get<Book[]>('/api/books')
//   //   this.set(data)
//   // }

//   // @Action({ rawError: true })
//   // public async createTodo(payload: Todo) {
//   //   const { data } = await $axios.post<Todo>('/api/todo', payload)
//   //   this.add(data)
//   // }

//   // @Action({ rawError: true })
//   // async deleteTodo(id: Number) {
//   //   await $axios.delete(`/api/todo/${id}`)
//   //   this.remove(id)
//   // }
// }