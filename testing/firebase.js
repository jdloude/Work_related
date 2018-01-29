// Initialize Firebase
var config = {
    apiKey: "AIzaSyB544SYrtK4qz1qRv1HAGdrqPAUSgH4NVA",
    authDomain: "ex-tract-o-logy.firebaseapp.com",
    databaseURL: "https://ex-tract-o-logy.firebaseio.com",
    projectId: "ex-tract-o-logy",
    storageBucket: "ex-tract-o-logy.appspot.com",
    messagingSenderId: "54259204090"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = $('#email').value;
        var password = $('#password').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            $('.signIn').disabled = false;
            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
    $('.signIn').disabled = true;
}
/**
 * Handles the sign up button press.
 */
function handleSignUp() {
    var email = $('#email').value;
    var password = $('#password').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
        email = "";
        password = "";
    });
    // [END createwithemail]
}
/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}

function sendPasswordReset() {
    var email = $('#email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}
/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        $('#quickstart-verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // [START_EXCLUDE]
            $('#quickstart-sign-in-status').textContent = 'Signed in';
            $('#signIn').textContent = 'Sign out';
            $('#quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            if (!emailVerified) {
                $('#quickstart-verify-email').disabled = false;
            }
            // [END_EXCLUDE]
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            $('#quickstart-sign-in-status').textContent = 'Signed out';
            $('.signIn').textContent = 'Sign in';
            $('#quickstart-account-details').textContent = 'null';
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        $('.signIn').disabled = false;
        // [END_EXCLUDE]
    });
    // [END authstatelistener]
    $('.signIn').on('click', toggleSignIn, false);
    $('.signUp').on('click', handleSignUp, false);
    $('#quickstart-verify-email').on('click', sendEmailVerification, false);
    $('.forgotPassword').on('click', sendPasswordReset, false);
}

$(".signUp").on('click', initApp)