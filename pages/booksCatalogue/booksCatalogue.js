const initialBooks = [
    { title: "To Kill a Mockingbird", author: "Harper Lee", rating: 5, image: ".images/1984.jpeg", description: "A novel about racial injustice in the Deep South." },
    { title: "1984", author: "George Orwell", rating: 4.5, image: "../../images/1984.jpeg", description: "A dystopian social science fiction novel and cautionary tale." },
    { title: "Don Quixote", author: "Miguel de Cervantes", rating: 4.6, image: "../../images/donq.jpeg", description: "A novel about the adventures of a nobleman who becomes a knight-errant." },
    { title: "Pride and Prejudice", author: "Jane Austen", rating: 4.8, image: "../../images/pride_prejudice.jpeg", description: "A romantic novel that critiques the British landed gentry at the end of the 18th century." },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", rating: 4.4, image: "../../images/gatsby 10.09.39.jpeg", description: "A novel about the American dream and its discontents." },
    { title: "Moby-Dick", author: "Herman Melville", rating: 4.2, image: "../../images/moby_dick.jpeg", description: "A novel about the voyage of the whaling ship Pequod." },
    { title: "War and Peace", author: "Leo Tolstoy", rating: 4.6, image: "../../images/war_and_peace.jpeg", description: "A historical novel that chronicles the French invasion of Russia." },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", rating: 4.3, image: "../../images/the-catcher-in-the-rye.jpg", description: "A story about teenage angst and alienation." },
    { title: "Wuthering Heights", author: "Emily Brontë", rating: 4.6, image: "../../images/Wuthering heights.jpg", description: "A novel about the intense and tragic love between Catherine Earnshaw and Heathcliff." },
    { title: "The Hobbit", author: "J.R.R. Tolkien", rating: 4.9, image: "../../images/the hobbit.jpg", description: "A fantasy novel that precedes Tolkien's Lord of the Rings." },
    { title: "Fahrenheit 451", author: "Ray Bradbury", rating: 4.4, image: "../../images/Fahrenheit 451.jpg", description: "A dystopian novel about a future where books are outlawed." },
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien", rating: 5, image: "../../images/the lord of the rings.jpg", description: "An epic fantasy novel about the quest to destroy the One Ring." },
    { title: "The Chronicles of Narnia", author: "C.S. Lewis", rating: 4.8, image: "../../images/chronicles-of-narnia.jpg", description: "A series of seven fantasy novels for children." },
    { title: "Brave New World", author: "Aldous Huxley", rating: 4.6, image: "../../images/BraveNewWorld.jpg", description: "A dystopian novel about a technologically advanced future." },
    { title: "The Alchemist", author: "Paulo Coelho", rating: 4.5, image: "../../images/The Alchemist.jpg", description: "A novel about a shepherd's journey to discover his personal legend." },
    { title: "Les Misérables", author: "Victor Hugo", rating: 4.7, image: "../../images/Les Misérables.jpg", description: "A novel set in post-revolutionary France." },
    { title: "The Kite Runner", author: "Khaled Hosseini", rating: 4.8, image: "../../images/The Kite Runner.jpg", description: "A story of friendship and redemption in Afghanistan." },
    { title: "Gone with the Wind", author: "Margaret Mitchell", rating: 4.4, image: "../../images/Gone with the wind.jpg", description: "A novel about the American South during and after the Civil War." },
    { title: "Catch-22", author: "Joseph Heller", rating: 4.5, image: "../../images/Catch-22.jpg", description: "A satirical novel set during World War II." },
    { title: "Dune", author: "Frank Herbert", rating: 4.7, image: "../../images/Dune.jpg", description: "A science fiction novel set on the desert planet Arrakis." },
];

if (!localStorage.getItem('booksCatalogue')) {
    
    localStorage.setItem('booksCatalogue', JSON.stringify(initialBooks));
}


let books = JSON.parse(localStorage.getItem('booksCatalogue'));

// Проверка дали потребителят е логнат
const loggedInUser = localStorage.getItem('loggedInUser');

// Генериране на бутони за вход, регистрация и изход
const header = document.getElementById('header-book-catalogue');
const authButtons = document.createElement('div');
authButtons.classList.add('auth-buttons');

if (loggedInUser) {

    authButtons.innerHTML =
        `<button id= "profile-btn">Profile</button>
    <button id="logout-btn">Logout</button>`;

} else {
    authButtons.innerHTML =
        `<button id="login-btn">Login</button>
        <button id="signup-btn">Sign Up</button>`;
}
header.appendChild(authButtons);

// Добавяне на логика за бутона "Logout"
if (loggedInUser) {
    const logoutBtn = document.getElementById('logout-btn');
    const profileBtn = document.getElementById('profile-btn');

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.reload();
    });

    profileBtn.addEventListener('click', () => {
        window.location.href = "../user-profile/user-profile.html";
    });


}


// Добавяне на логика за бутоните "Login" и "Sign Up"
if (!loggedInUser) {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');

    loginBtn.addEventListener('click', () => {
        window.location.href = '../login-signup/login/log-in.html';
    });

    signupBtn.addEventListener('click', () => {
        window.location.href = '../login-signup/signup/sign-up.html';
    });
}

// Функция за показване на книги
function displayBooks(filteredBooks) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; 

    if (filteredBooks.length === 0) {
        bookList.innerHTML = '<p>No books found.</p>';
    } else {
        filteredBooks.forEach((book, index) => {
                    const bookDiv = document.createElement('div');
                    bookDiv.classList.add('book');
                    bookDiv.innerHTML = `
                <img src="../../images/${book.image}" alt="${book.title}">
                <h2>${book.title}</h2>
                <h3>${book.author}</h3>
                <p>Rating: ${book.rating}</p>
                <button class="more-info-btn" data-title="${book.title}">More info</button>
                ${loggedInUser === book.addedBy ? `<button class="delete-book-btn" data-index="${index}">Delete</button>` : ''}`;
            bookList.appendChild(bookDiv);
        });

        // Добавяне на събитие за бутона "More info"
        document.querySelectorAll('.more-info-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const bookTitle = event.target.getAttribute('data-title');
                window.location.href = `../more-info/more-info.html?title=${encodeURIComponent(bookTitle)}`;
            });
        });

        // Добавяне на събитие за бутона "Delete"
        document.querySelectorAll('.delete-book-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const bookIndex = event.target.getAttribute('data-index');
                books.splice(bookIndex, 1);
                localStorage.setItem('booksCatalogue', JSON.stringify(books));
                displayBooks(books);
            });
        });
    }
}



// Функция за филтриране на книгите според търсения текст
function filterBooks(searchText) {
    return books.filter(book => book.title.toLowerCase().includes(searchText.toLowerCase()));
}

function displayTopRatedBooks() {
    const sortedBooks = [...books].sort((a, b) => b.rating - a.rating); // Сортиране на книгите по рейтинг в низходящ ред
    const top10Books = sortedBooks.slice(0, 10); // Вземане на първите 10 книги
    displayBooks(top10Books); // Показване само на топ 10 книги
}

// Извикване на функцията за показване на книгите при зареждане на страницата
displayBooks(books);

// Скриване на формата за добавяне на нова книга, ако потребителят не е логнат
if (!loggedInUser) {
    document.querySelector('.add-book-form').style.display = 'none';
}

// Добавяне на нова книга
const addBookForm = document.querySelector('.add-book-form');
addBookForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const rating = document.getElementById('rating').value.trim();
    const image = document.getElementById('image').files[0];

    // Валидация на входните полета
    if (!title || !author || !rating || !image) {
        alert('All fields are required.');
        return;
    }

    const newBook = {
        title,
        author,
        rating,
        image: image.name, 
        description: "No description available.", 
        addedBy: loggedInUser
    };

    // Добавяне на новата книга в каталога
    books.push(newBook);

    // Обновяване на localStorage с новата книга
    localStorage.setItem('booksCatalogue', JSON.stringify(books));

    // Обновяване на списъка с книги
    displayBooks(books);

    // Изчистване на формата
    addBookForm.reset();
});

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');

    mobileMenuButton.addEventListener('click', () => {
        navList.classList.toggle('active');
    });
});


// Добавяне на функционалност за търсене на книги
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', (event) => {
    const searchText = event.target.value.trim();

    if (searchText === '') {
        displayBooks(books); 
    } else {
        const filteredBooks = filterBooks(searchText);
        displayBooks(filteredBooks);
    }
});

const topRatedLink = document.getElementById('top-rated-link');
topRatedLink.addEventListener('click', (event) => {
    event.preventDefault();
    displayTopRatedBooks();
});

// Взимане на "Book Popularity"
let bookPopularity = JSON.parse(localStorage.getItem('bookPopularity')) || {};

// Функция за показване на топ 10 най популярни книги
function displayTopPopularBooks() {
    const popularBooks = [...books].sort((a, b) => (bookPopularity[b.title] || 0) - (bookPopularity[a.title] || 0));
    const top10Books = popularBooks.slice(0, 10);
    displayBooks(top10Books);
}

// Добавяне на  event listener за показване на топ 10 най популярни книги
const topPopularLink = document.getElementById('top-popular-link');
topPopularLink.addEventListener('click', (event) => {
    event.preventDefault();
    displayTopPopularBooks(); 
});
// Извикваме displayBooks(books) първоначално да запълним масива буукс
displayBooks(books);