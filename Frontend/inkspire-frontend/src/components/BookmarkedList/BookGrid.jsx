import React from 'react';
import { BookCard } from './BookCard';
import '../../styles/BookGrid.css';

export const BookGrid = ({ books, onRemoveBookmark, selectedBooks, onSelectBook }) => {
  return (
    <div className="book-grid">
      {books.map(book => (
        <BookCard 
          key={book.id}
          book={book}
          isSelected={selectedBooks.includes(book.id)}
          onSelect={() => onSelectBook(book.id)}
          onRemove={() => onRemoveBookmark(book.id)}
          view="grid"
        />
      ))}
    </div>
  );
};