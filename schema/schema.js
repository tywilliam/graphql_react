const graphql = require('graphql');
const _ = require('lodash');

const Book = require('../models/Book');
const Author = require('../models/Author');
const { GraphQLObjectType,
     GraphQLSchema,
      GraphQLString,
       GraphQLID,
        GraphQLInt,
         GraphQLList,
        GraphQLNonNull } = graphql;

// dummy data 
var books = [
    { name: 'Name of the Wind,', genre: 'Fantasy', id: '1', authorid: '1'},
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorid: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorid: '3' }
];
const authors = [
    { name: 'Brandon Sanderson', age: 42, id: '2' },
    { name: 'Terry Pratchett', age: 66, id: '3' },
    { name: 'Willy Madden', age: 42, id: '4'}
];
const bookstores = [
    { name: 'Barnes & Noble', address: '1419 Southern Ave', type: 'Brick & Mortar', id: '1'},
    { name: 'Barnes & Noble', address: '111 Turns Street', type: 'Building', id: '2'},
    { name: 'Barnes & Noble', address: '222 Dreams Street', type: 'Custom', id: '3'},
    { name: 'Maiden book store', address: '23 Eastwhich St ', type: 'Brick & Mortar', id: '4'}
    
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                console.log(parent);
                //return _.find(authors, { id: parent.authorid});
                return Author.findById(parent.authorId);
            }
        }
    })
})
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                //return _filter(books, { authorId: parent.id })
                return Book.find({ authorId: parent.id })
            }
        }
    })
})
const BookStoreType = new GraphQLObjectType({
    name: 'BookStoreType',
    fields: () => ({
        id: { type: GraphQLString},
        name: { type: GraphQLString},
        address: { type: GraphQLString },
        type: { type: GraphQLString }
    })
})
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLString }, name: { type: GraphQLString }},
            resolve(parent, args) {
                console.log(typeof(args.id));
                return Book.findById(args.id);
                //return _.find(books, { id: args.id});
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID} },
            resolve(parent, args) {
                //return _.find(authors,{ id: args.id });
                return Author.findById(args.id);
            }
        },
        bookstores: {
            type: BookStoreType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                //return _.find(bookstores, { id: args.id });
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({});
            }
        }

    }
});
const AddMutation = new GraphQLObjectType({
    name: 'AddMutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save(author);

            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorid: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorid: args.authorid
                });
                return book.save(book);
            }
        }
    }
})
module.exports = new GraphQLSchema({ 
    query: RootQuery,
    mutation: AddMutation
})
/**
 * book(id: '123') {
 *  name,
 *  genre 
 * }
 */