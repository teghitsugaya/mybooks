document.addEventListener("DOMContentLoaded", function () {
  
    const inputBook = document.getElementById("inputBook");
    const inputSearchBook = document.getElementById("searchBook");
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
  
    inputBook.addEventListener("submit", function (event) {
      event.preventDefault();
      addBook();
    });
  
    inputSearchBook.addEventListener("keyup", function (event) {
      event.preventDefault();
      searchBook();
    });
  
    inputSearchBook.addEventListener("submit", function (event) {
      event.preventDefault();
      searchBook();
    });
  
    inputBookIsComplete.addEventListener("input", function (event) {
      event.preventDefault();
      checkButton();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });
  

  function addBook() {
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");

    const generatedID = generateId();
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    
    const isComplete = document.getElementById("inputBookIsComplete").checked;
    const book = makeBook(bookTitle, `Penulis: ${bookAuthor}`, `Tahun: ${bookYear}`, isComplete);
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isComplete);

    book["itemId"] = bookObject.id;
    books.push(bookObject);

    if (isComplete) {
        completeBookshelfList.append(book);
    } else {
        incompleteBookshelfList.append(book);
    }
    updateDataToStorage();
    alert("Buku Berhasil Ditambahkan!");
}

function generateId() {
    return +new Date();
  }

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}


  function makeBook(title, author, year, isComplete) {
      const bookTitle = document.createElement("h3");
      bookTitle.innerText = title;
  
      const bookAuthor = document.createElement("p");
      bookAuthor.innerText = author;
  
      const bookYear = document.createElement("p");
      bookYear.innerText = year;
  
      const bookAction = document.createElement("div");
      bookAction.classList.add("action");
      if (isComplete) {
          bookAction.append(
              createUndoButton(),
              createTrashButton()
          );
      } else {
          bookAction.append(
              createCheckButton(),
              createTrashButton()
          );
      }
  
      const container = document.createElement("article");
      container.classList.add("book_item");
      container.append(bookTitle, bookAuthor, bookYear, bookAction);
  
      return container;
  }
  
function createUndoButton() {
   return createButton("green", "Belum selesai dibaca", function (event) {
       undoBookFromCompleted(event.target.parentElement.parentElement);
   });
}

function createTrashButton() {
    return createButton("red", "Hapus buku", function (event) {
        removeBook(event.target.parentElement.parentElement);
    });
}

function createCheckButton() {
    return createButton("green", "Selesai dibaca", function (event) {
        addBookToCompleted(event.target.parentElement.parentElement);
    });
}

function checkButton() {
  const span = document.querySelector("span");
  if (inputBookIsComplete.checked) {
      span.innerText = "Selesai dibaca";
  } else {
      span.innerText = "Belum selesai dibaca";
  }
}

function createButton(buttonTypeClass, buttonText, eventListener) {
    const button = document.createElement("button");
    button.innerText = buttonText;
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });

    return button;
}


  function addBookToCompleted(bookElement) {
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    const bookTitle = bookElement.querySelector("h3").innerText;
    const bookAuthor = bookElement.querySelectorAll("p")[0].innerText;
    const bookYear = bookElement.querySelectorAll("p")[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(bookElement["itemId"]);
    book.isComplete = true;
    newBook["itemId"] = book.id;

    completeBookshelfList.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}


function removeBook(bookElement) {
    const isDelete = window.confirm("Yakin menghapus buku ini?");
    if (isDelete) {
        const bookPosition = findBookIndex(bookElement["itemId"]);
        books.splice(bookPosition, 1);
        bookElement.remove();
        updateDataToStorage();
        alert("Buku Terhapus");
    }
}

function undoBookFromCompleted(bookElement) {
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const bookTitle = bookElement.querySelector("h3").innerText;
    const bookAuthor = bookElement.querySelectorAll("p")[0].innerText;
    const bookYear = bookElement.querySelectorAll("p")[1].innerText;
    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);

    const book = findBook(bookElement["itemId"]);
    book.isComplete = false;
    newBook["itemId"] = book.id;

    incompleteBookshelfList.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}


function searchBook() {
    const searchBook = document.getElementById("searchBookTitle");
    const filter = searchBook.value.toUpperCase();
    const bookItem = document.querySelectorAll("section.book_shelf > .book_list > .book_item");
    for (let i = 0; i < bookItem.length; i++) {
        txtValue = bookItem[i].textContent || bookItem[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            bookItem[i].style.display = "";
        } else {
            bookItem[i].style.display = "none";
        }
    }
}


  const STORAGE_KEY = "BOOKSHELF_APPS";
  let books = [];
  
  function isStorageExist() {
      if (typeof (Storage) === undefined) {
          alert('Browser kamu tidak mendukung local storage');
          return false;
      }
      return true;
  }
  

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null)
        books = data;

    document.dispatchEvent(new Event("ondataloaded"));
}

  function saveData() {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event("ondatasaved"));
  }
  
  
  function updateDataToStorage() {
      if (isStorageExist())
          saveData();
  }
  

  function findBookIndex(bookId) {
    let index = 0
    for (book of books) {
        if (book.id === bookId)
            return index;

        index++;
    }
    return -1;
}

function findBook(bookId) {
    for (book of books) {
        if (book.id === bookId)
            return book;
    }
    return null;
}

    document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
  });

  function refreshDataFromBooks() {
      const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
      const completeBookshelfList = document.getElementById("completeBookshelfList");
  
      for (book of books) {
          const newBook = makeBook(book.title, `Penulis: ${book.author}`, `Tahun: ${book.year}`, book.isComplete);
          newBook["itemId"] = book.id;
  
          if (book.isComplete) {
              completeBookshelfList.append(newBook);
          } else {
              incompleteBookshelfList.append(newBook);
          }
      }
  }