// Взимане на заглавието на книгите през параметрите на URL 
const urlParams = new URLSearchParams(window.location.search);
const bookTitle = urlParams.get('title');

// Взимане на книгите от localStorage
const books = JSON.parse(localStorage.getItem('booksCatalogue'));

// Намиране на ткущата книга по заглавие
const book = books.find(b => b.title === bookTitle);

// Показване на детайлите на книгата
const bookDetails = document.getElementById('book-details');
if (book) {
    bookDetails.innerHTML = `
        <h1>${book.title}</h1>
        <h4>${book.author}</h4>
        <img src="../../images/${book.image}" alt="${book.title}">
        <p>${book.description}</p>
        <p>Rating: ${book.rating}</p>
    `;
} else {
    bookDetails.innerHTML = '<p>Book not found.</p>';
}
// Добавяне на функционалност към "Back to Catalogue" бутона
const backButton = document.getElementById('back-btn');
if (backButton) {
    backButton.addEventListener('click', () => {
        window.location.href = '../booksCatalogue/booksCatalogue.html';
    });
}


// Проверка дали юзъра се е логнал
const loggedInUser = localStorage.getItem('loggedInUser');

// Показване на формата за ревюта ако се е логнал
const addReviewForm = document.getElementById('add-review-form');
if (loggedInUser) {
    addReviewForm.style.display = 'block';
} else {
    addReviewForm.style.display = 'none';
}

// Зареждане на ревюта от localStorage
let reviews = JSON.parse(localStorage.getItem('bookReviews')) || {};
let comments = JSON.parse(localStorage.getItem('reviewComments')) || {};
let bookPopularity = JSON.parse(localStorage.getItem('bookPopularity')) || {};

function updateBookPopularity() {
    if (!bookPopularity[bookTitle]) {
        bookPopularity[bookTitle] = 0;
    }
    bookPopularity[bookTitle] = (reviews[bookTitle]?.length || 0) + Object.values(comments[bookTitle] || {}).reduce((acc, cur) => acc + cur.length, 0);
    localStorage.setItem('bookPopularity', JSON.stringify(bookPopularity));
}

// Функция за показване на ревюта от конкретната книга
function displayReviews() {
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = '';

    if (reviews[bookTitle] && reviews[bookTitle].length > 0) {
        reviews[bookTitle].forEach((review, reviewIndex) => {
            const reviewDiv = document.createElement('div');
            reviewDiv.classList.add('review');
            reviewDiv.innerHTML = `
                <p>${review.text}</p>
                <p><em>by ${review.user}</em></p>
                ${loggedInUser === review.user ? `<button class="delete-review-btn" data-index="${reviewIndex}">Delete</button>` : ''}
                <div class="comments-section">
                    <h4>Comments:</h4>
                    <div class="comments-list" data-review-index="${reviewIndex}"></div>
                    ${loggedInUser ? `<form class="add-comment-form" data-review-index="${reviewIndex}">
                        <textarea placeholder="Add a comment..."></textarea>
                        <button type="submit">Add Comment</button>
                    </form>` : ''}
                </div>`;
            reviewsList.appendChild(reviewDiv);

            // Покажи съществуващите коментари за ревюто
            displayComments(reviewIndex);



            // добавянето на нов коментар
            const addCommentForm = reviewDiv.querySelector('.add-comment-form');
            if (addCommentForm) {
                addCommentForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const commentText = addCommentForm.querySelector('textarea').value.trim();

                    if (!commentText) {
                        alert('Comment cannot be empty.');
                        return;
                    }

                    const newComment = {
                        text: commentText,
                        user: loggedInUser
                    };

                    // Добаваяне на комеентар към листа с коментари на конкретното ревю
                    if (!comments[bookTitle]) {
                        comments[bookTitle] = {};
                    }
                    if (!comments[bookTitle][reviewIndex]) {
                        comments[bookTitle][reviewIndex] = [];
                    }
                    comments[bookTitle][reviewIndex].push(newComment);

                    // Обновява localStorage с новия коментар
                    localStorage.setItem('reviewComments', JSON.stringify(comments));

                    //Обновява коментарите
                    displayComments(reviewIndex);

                    updateBookPopularity();

                    // Чисти формата
                    addCommentForm.reset();

                });
            }
        });

        // Add event listener for delete review buttons
        document.querySelectorAll('.delete-review-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const reviewIndex = event.target.getAttribute('data-index');

                // Remove the comments associated with this review
                if (comments[bookTitle] && comments[bookTitle][reviewIndex]) {
                    delete comments[bookTitle][reviewIndex];
                    localStorage.setItem('reviewComments', JSON.stringify(comments));
                }

                // Remove the review itself
                reviews[bookTitle].splice(reviewIndex, 1);
                localStorage.setItem('bookReviews', JSON.stringify(reviews));

                updateBookPopularity();

                // Refresh the display
                displayReviews();
            });
        });
    } else {
        reviewsList.innerHTML = '<p>No reviews yet.</p>';
    }
}

// Function to display comments for a review
function displayComments(reviewIndex) {
    const commentsList = document.querySelector(`.comments-list[data-review-index="${reviewIndex}"]`);
    commentsList.innerHTML = '';

    if (comments[bookTitle] && comments[bookTitle][reviewIndex] && comments[bookTitle][reviewIndex].length > 0) {
        comments[bookTitle][reviewIndex].forEach((comment, commentIndex) => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');
            commentDiv.innerHTML = `
                <p>${comment.text}</p>
                <p><em>by ${comment.user}</em></p>
                ${loggedInUser === comment.user ? `<button class="delete-comment-btn" data-review-index="${reviewIndex}" data-comment-index="${commentIndex}">Delete</button>` : ''}
            `;
            commentsList.appendChild(commentDiv);
        });

        // Handle deleting a comment
        document.querySelectorAll('.delete-comment-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const reviewIdx = event.target.getAttribute('data-review-index');
                const commentIdx = event.target.getAttribute('data-comment-index');
                comments[bookTitle][reviewIdx].splice(commentIdx, 1);
                localStorage.setItem('reviewComments', JSON.stringify(comments));
                displayComments(reviewIdx);
            });
        });
    } else {
        commentsList.innerHTML = '<p>No comments yet.</p>';
    }
}


// Display reviews on page load
  displayReviews();

// Add a new review
if (addReviewForm) {
    addReviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const reviewText = document.getElementById('review-text').value.trim();

        if (!reviewText) {
            alert('Review text cannot be empty.');
            return;
        }

        const newReview = {
            text: reviewText,
            user: loggedInUser // Track the user who added the review
        };

        // Add the review to the list
        if (!reviews[bookTitle]) {
            reviews[bookTitle] = [];
        }
        reviews[bookTitle].push(newReview);

        // Update localStorage with the new review
        localStorage.setItem('bookReviews', JSON.stringify(reviews));
        displayReviews();
        addReviewForm.reset();
    });
}
updateBookPopularity();