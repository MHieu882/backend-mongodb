import mongoose, { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';
import _ from 'lodash';

mongoose.connect('mongodb://localhost:27017/populate');

const book = Schema({
  title: String,
  author: [{ type: Schema.Types.ObjectId, ref: 'Author' }],
});
const person = Schema({
  _id: Schema.Types.ObjectId,
  firstname: String,
  lastname: String,
});
const Book = mongoose.model('Book', book);
const Author = mongoose.model('Author', person);
// create data
for (let i = 1; i < 3; i += 1) {
  const author1 = new Author({
    _id: new mongoose.Types.ObjectId(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
  });
  const author2 = new Author({
    _id: new mongoose.Types.ObjectId(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
  });
  const Book1 = new Book({
    title: faker.animal.cat(),
    author: [author1._id, author2._id],
  });
  // author1.save();
  // author2.save();
  // Book1.save();
}

async function populate1(Book) {
  const result = await Book.aggregate([{
    $lookup: {
      from: 'authors',
      localField: 'author',
      foreignField: '_id',
      as: 'author',
    },
  }]);
  return result;
}

async function populate2(Book) {
  const books = await Book.find();
  for (let i = 0; i < books.length; i += 1) {
    for (let j = 0; j < books[i].author.length; j += 1) {
      const author = await Author.find({ _id: books[i].author[j] });
      // _.set(books, books[i].author[j], author);
      _.update(books, books[i].author[j], n => n = author);
    }
  }
  return books;
}


console.log(await populate1(Book));
console.log(await populate2(Book));
