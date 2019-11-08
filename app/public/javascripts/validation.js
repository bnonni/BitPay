function validate(form) {
    var password = form.password.value,
        username = form.username.value;

    // If confirm password not entered 
    if (username.length < 1) {
        event.preventDefault();
        error("usr", "redinput", "username_error", '<li class="errors" id="usernameError">Username must be at least 1 character long.</li>');
        return false;
    }
    // If password not entered 
    if (password.length < 1) {
        event.preventDefault();
        error("pwd", "redinput", "password_error", '<li class="errors" id="passwordError"> Password must be at least 1 character long.</li>');
        return false;
    }
    return true;
}

function error(id, color, econtain, msg) {
    document.getElementById(id).className += color; //add input error style class
    var error = document.getElementById(econtain);
    error.style.display += "block";
    error.innerHTML += msg; //append error message
}

function printError(msg) {
    var errors = document.getElementById();
    errors.style.display += "block";
    errors.innerHTML += msg; //append error message
}