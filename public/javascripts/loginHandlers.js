// AJAX-Enabled Login and Registration Forms
/*
This JavaScript code is designed to handle form submissions for user login and registration in a web application. It uses the Fetch API to send AJAX requests to the server, allowing the page to update without a full refresh.

The code first selects the login form using its ID with document.getElementById('loginForm'). It checks if the login form exists on the page, and if it does, it adds an event listener for the 'submit' event. When the form is submitted, the event listener function is triggered.

Inside the event listener function, the default form submission is prevented using event.preventDefault(). This stops the page from refreshing, which is the default behavior for form submissions. The username and password values are then extracted from the form.

A POST request is sent to the '/users/login' endpoint using the Fetch API. The username and password are included in the request body as a JSON string. The 'Content-Type' header is set to 'application/json' to let the server know the format of the request body.

The Fetch API returns a Promise that resolves to the Response object representing the response from the server. This is converted to a JSON object using the response.json() method, which also returns a Promise.

The Promise returned by response.json() is then handled. If the server responds with an error, it is displayed using alert(). If the login is successful, the user is redirected to the homepage using window.location.href = '/'.

The same process is repeated for the registration form, but the POST request is sent to the '/users/register' endpoint instead. If the registration is successful, the user is redirected to the login page.

If an error occurs at any point during the Fetch request, it is logged to the console using console.error(). If the login or registration form is not found on the page, a warning is logged to the console.
*/

// Login form
// Select the login form by its ID
var loginForm = document.getElementById('loginForm');

// Check if the login form exists
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        // Prevent the form from submitting normally
        event.preventDefault();

        // Get the username and password values from the form
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Send a POST request to the /users/login endpoint
        fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                // If there's an error, display it
                if (data.error) {
                    alert(data.error);
                } else {
                    // If the login was successful, redirect to the homepage
                    // TODO UPDATE WITH WINDOW CHANGE ACTION

                    window.location.href = '/';
                }
            })
            .catch(error => console.error('Error:', error)); // Log any errors
    });
} else {
    console.warn('Login form not found on the page.');
}
// Registration form
// Select the registration form by its ID
var registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
        // Prevent the form from submitting normally
        event.preventDefault();

        // Get the username and password values from the form
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Send a POST request to the /users/register endpoint
        fetch('/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                // If there's an error, display it
                if (data.error) {
                    alert(data.error);
                } else {
                    // If the registration was successful, redirect to the login page
                    window.location.href = '/users/login';
                    // TODO UPDATE WITH WINDOW CHANGE ACTION
                }
            })
            .catch(error => console.error('Error:', error)); // Log any errors
    });
} else {
    console.warn('Register form not found on the page.');
}
