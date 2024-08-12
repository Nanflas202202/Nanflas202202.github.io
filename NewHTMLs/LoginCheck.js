document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form-inner');
    const content = document.getElementById('MainContent');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const validUsers = [
        { username: 'Nanflas202202Admin', password: '#!nW2O2202E8#' },
        // Add more valid users here
    ];

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const validUser = validUsers.find(user =>
            user.username === usernameInput.value &&
            user.password === passwordInput.value
        );

        if (validUser) {
            form.style.display = 'none'; // Hide the login form
            content.style.display = 'block'; // Show the protected content
			document.getElementById('login-form').style.display = 'none'; 
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });
});