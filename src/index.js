import {GraphQLServer} from 'graphql-yoga'
import { Server } from 'net'
import uuidv4 from 'uuid/v4'
 const typeDefs = `
    type Query{
        book(query: String): [Book!]!
    }

    type Mutation{
        createBook(data: CreateBookInput): Book!
        deleteBook(id:ID!): Book!
    }

    input CreateBookInput{
        name: String!,
        author: String!,
        publish: String!,
        release: String!
    }

    type Book{
        id: ID!
        name: String!
        author: Author!
        publish: String!
        release: String!
    }

    type Author{
        id: ID!
        name: String!
        age: Int
        email: String
    }
 `

 const books = [{
    id: '1',
    name: 'Doraemon',
    author: '1',
    publish: 'Kim Dong',
    release: '1/1/2019'
},
{
    id: '2',
    name: 'Naruto',
    author: '2',
    publish: 'Tre',
    release: '2/2/2019'   
},
{
    id: '3',
    name: 'Bach Khoa',
    author: '3',
    publish: 'BK',
    release: '3/3/2019'
}];

const authors = [{
    id: '1',
    name: 'Tokuda',
    age: 80
},
{
    id: '2',
    name:'Ozawa',
    age: 30,
    email: 'maria_ozawa@gmail.com'
},{
    id: '3',
    name: 'NTQ',
    age: 45
}];

 const resolvers = {
    Query:{
        book(parent, args, ctx, info){
            if (!args.query){
                return books;
            } 
            return books.filter((book)=>{
                const isNameMatch = book.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
                return isNameMatch
            })
        }
    },
    Book:{
        author(parent, args, ctx, info){
            return authors.find((author)=>{
                return author.id == parent.author
            })
        }
    },
    Mutation:{
        createBook(parent,args,ctx,info){
            const bookTaken = books.some((book)=>book.name === args.data.name)
            if (bookTaken){
                throw new Error('Name taken')
            }
            const book = {
                id: uuidv4(),
                ...args.data
            }
            books.push(book)
            return book
        },
        
      deleteBook(parent, args,ctx,info){
        const bookIndex = books.findIndex((book)=>book.id===args.id)
        if (bookIndex===-1){
          throw new Error('Book not found')
        }

        const deletedBooks = books.splice(bookIndex,1)

        return deletedBooks[0]
      }
    }
 }

 const server = new GraphQLServer({
     typeDefs,
     resolvers
 })

 server.start(()=>{
     console.log('Server is up!')
 })
