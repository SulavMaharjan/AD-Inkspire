import React from 'react';
import { BookCard } from './BookCard';
import '../../styles/BookList.css';

export const BookList = ({ books, onRemoveBookmark, selectedBooks, onSelectBook }) => {
  return (
    <div className="book-list">
      {books.map(book => (
        <BookCard 
          key={book.id}
          book={book}
          isSelected={selectedBooks.includes(book.id)}
          onSelect={() => onSelectBook(book.id)}
          onRemove={() => onRemoveBookmark(book.id)}
          view="list"
        />
      ))}
    </div>
  );
};