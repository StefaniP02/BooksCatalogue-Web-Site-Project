const loggedInUser = localStorage.getItem('loggedInUser');
const profileForm = document.getElementById('profile-form');
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const infoInput = document.getElementById('info');
const profilePicture = document.getElementById('profile-picture');
const profilePictureInput = document.getElementById('profile-picture-input');
const uploadProfilePictureBtn = document.getElementById('upload-profile-picture-btn');
const resetProfilePictureBtn = document.getElementById('reset-profile-picture-btn');
const deleteProfileBtn = document.getElementById('delete-profile-btn');
const userBookList = document.getElementById('user-book-list');

// Зареждане на юзър профила от localStorage
const user = JSON.parse(localStorage.getItem(loggedInUser));
emailInput.value = user.email;
usernameInput.value = user.username || '';
nameInput.value = user.name || '';
ageInput.value = user.age || '';
infoInput.value = user.info || '';
profilePicture.src = user.profilePicture || '../../images/blank-profile-picture-973460_960_720.webp';

// Събмитване на формата на профила
profileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    user.username = usernameInput.value.trim();
    user.name = nameInput.value.trim();
    user.age = ageInput.value.trim();
    user.info = infoInput.value.trim();

    localStorage.setItem(loggedInUser, JSON.stringify(user));
    alert("Profile updated successfully!");
});

// Добавяне на снимка на потребителя
uploadProfilePictureBtn.addEventListener('click', () => {
    profilePictureInput.click();
});

profilePictureInput.addEventListener('change', () => {
    const file = profilePictureInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        profilePicture.src = event.target.result;
        user.profilePicture = event.target.result;
        localStorage.setItem(loggedInUser, JSON.stringify(user));
    };

    reader.readAsDataURL(file);
});

// Ресетва снимката на потребителя
resetProfilePictureBtn.addEventListener('click', () => {
    profilePicture.src = '../../images/blank-profile-picture-973460_960_720.webp';
    user.profilePicture = '';
    localStorage.setItem(loggedInUser, JSON.stringify(user));
});

// Триеене на профил
deleteProfileBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
        // Стъпка 1: Триене на профила
        localStorage.removeItem(loggedInUser);

        // Стъпка 2: Премахване на книгите от този потребител
        let books = JSON.parse(localStorage.getItem('booksCatalogue')) || [];
        books = books.filter(book => book.addedBy !== loggedInUser);
        localStorage.setItem('booksCatalogue', JSON.stringify(books));

        // Стъпка 3: Премахване на ревюта от потребителя
        let reviews = JSON.parse(localStorage.getItem('bookReviews')) || {};
        for (const bookTitle in reviews) {
            reviews[bookTitle] = reviews[bookTitle].filter(review => review.user !== loggedInUser);
            if (reviews[bookTitle].length === 0) {
                delete reviews[bookTitle];
            }
        }
        localStorage.setItem('bookReviews', JSON.stringify(reviews));

        // Стъпка 4:  Премахване на коментари от потребителя
        let comments = JSON.parse(localStorage.getItem('reviewComments')) || {};
        for (const bookTitle in comments) {
            for (const reviewId in comments[bookTitle]) {
                comments[bookTitle][reviewId] = comments[bookTitle][reviewId].filter(comment => comment.user !== loggedInUser);
                if (comments[bookTitle][reviewId].length === 0) {
                    delete comments[bookTitle][reviewId];
                }
            }
            if (Object.keys(comments[bookTitle]).length === 0) {
                delete comments[bookTitle];
            }
        }
        localStorage.setItem('reviewComments', JSON.stringify(comments));

        // Стъпка 5:  Премахване сесиията на потребителя
        localStorage.removeItem('loggedInUser');

        alert("Profile and associated data deleted successfully.");
        window.location.href = "../login-signup/login/log-in.html";
    }
});

// Триене на специфични полета
function deleteField(field) {
    switch (field) {
        case 'username':
            usernameInput.value = '';
            user.username = '';
            break;
        case 'name':
            nameInput.value = '';
            user.name = '';
            break;
        case 'age':
            ageInput.value = '';
            user.age = '';
            break;
        case 'info':
            infoInput.value = '';
            user.info = '';
            break;
    }
    localStorage.setItem(loggedInUser, JSON.stringify(user));
    alert(`${field.charAt(0).toUpperCase() + field.slice(1)} deleted successfully!`);
}

// Показване на книгите, добавени от потребителя
function displayUserBooks() {
    const books = JSON.parse(localStorage.getItem('booksCatalogue')) || [];
    const userBooks = books.filter(book => book.addedBy === loggedInUser);

    userBookList.innerHTML = '';

    if (userBooks.length > 0) {
        userBooks.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');
            bookDiv.innerHTML = `
                <img src="../../images/${book.image}" alt="${book.title}">
                <div>
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                    <p>Rating: ${book.rating}</p>
                </div>
            `;
            userBookList.appendChild(bookDiv);
        });
    } else {
        userBookList.innerHTML = '<p>You have not added any books yet.</p>';
    }
}

displayUserBooks();
