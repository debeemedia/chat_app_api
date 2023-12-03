// WEEK FOURTEEN
//   TASK ONE:
// Create a server using express and connect it to a database. The database should have three tables (model) users, posts and comments.
// As usual, give them a controller and map them all to a router.js file as in the previous task.
// Posts table:id: string, body: string, userId: uuid, title: string. Users table: id: string, email: string, password: string, username: string, postId: uuid, commentId: uuid, Comments table: postId: uuid, id: string, id: string, body: string (data types of each column)
// Encrypt the user’s password before saving it to the database using a library jwt (json web token)
// Make all the corresponding controllers return a successful message if successful and a failure message if there is an error. Hence account for error handling  50 mks
//    TASK TWO: Make some additions to the existing project of task six.
// Add a signup and sign-in controller to create and login users respectively. Ensure you account for it in the router.js
// Write a unit test using jest for the modular functions. 
// Deploy your app to a web server hosting platform. (render.com should be considered)
// Create an account with render.com and follow suit.  50 mks