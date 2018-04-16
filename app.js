var bookList = (function() {

  var Book = {
    getBook: function(t, a, i) {
      var bookObject = {
        title : t,
        author : a,
        isbn : i
      }
      return bookObject;
    }
  };

  var Store = {

    getBooks: function() {
      let books;
      if(localStorage.getItem('books') === null) {
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem('books'));
      }
      return books;
    },
  
    displayBooks: function() {
      const books = Store.getBooks();
      books.forEach(function(book){
        UI.addBookToList(book);
      });
      if (books.length > 0) {
        document.getElementById('book-list').parentElement.style.display = 'table';
      } else {
        document.getElementById('book-list').parentElement.style.display = 'none';
      }
    },
  
    addBook: function(book) {
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
    },
  
    removeBook: function(isbn) {
      const books = Store.getBooks();
      books.forEach(function(book, index){
       if(book.isbn === isbn) {
        books.splice(index, 1);
       }
      });

      if (books.length === 0) {
        localStorage.clear();
        document.getElementById('book-list').parentElement.style.display = 'none';
      } else {
        localStorage.setItem('books', JSON.stringify(books));
      }
    }
  };

  var UI = {

    addBookToList: function(book){
      const list = document.getElementById('book-list');
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X<a></td>
      `;
      list.appendChild(row);
    },

    showAlert: function(message, className) {
      const div = document.createElement('div');
      div.className = `alert ${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#book-form');
      container.insertBefore(div, form);
      setTimeout(function(){
        document.querySelector('.alert').remove();
      }, 3000);
    },

    deleteBook: function(target){
      if(target.className === 'delete') {
        target.parentElement.parentElement.remove();
      }
    },

    clearFields: function() {
      document.getElementById('title').value = '';
      document.getElementById('author').value = '';
      document.getElementById('isbn').value = '';
    }
  };

  var module = {

    addBook: function(e){
      var title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value,
          book;

      if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'error');
      } else {
        book = Book.getBook(title, author, isbn);
        Store.addBook(book);
        UI.addBookToList(book);
        UI.showAlert('Book Added!', 'success');
        UI.clearFields();
        if (document.getElementById('book-list').parentElement.style.display === 'none') {
          document.getElementById('book-list').parentElement.style.display = 'table';
        }
      }
      e.preventDefault();
    },

    deleteBook: function(e){
      UI.deleteBook(e.target);
      Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
      UI.showAlert('Book Removed!', 'success');
      e.preventDefault();
    },

    addListeners: function() {
      document.addEventListener('DOMContentLoaded', Store.displayBooks);
      document.getElementById('book-form').addEventListener('submit', module.addBook);
      document.getElementById('book-list').addEventListener('click', module.deleteBook);
    },

    init: function() {
      module.addListeners();
      console.log('- bookList initialized');
    }
  };

  return {
    init: module.init
  };

})();

document.addEventListener('DOMContentLoaded', bookList.init());
