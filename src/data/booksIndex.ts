import book1 from './books/book1.json';

export const books = [{
     ...book1,
    coverImage: require('../../assets/image/icon.png'),
    },
] as const;

export function getBookById(id: string) {
    return books.find((book) => book.id == id);
}

export function getAllBooks() {
    return books;
}
