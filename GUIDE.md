GET Home
http://localhost:2023/


POST: REGISTER (CREATE USER)
http://localhost:2023/users/register
{
  "email": "ebeleijeomaokeke@gmail.com",
  "password": "password",
  "username": "ebeleijeoma"
}

POST: LOGIN
http://localhost:2023/users/login
with email/username and password

GET: LOGOUT
http://localhost:2023/users/logout

POST: CREATE POST
http://localhost:2023/posts/create
{
  "title": "Tech Debee's first post",
  "body": "lorem lorem lorem lorem ipsum ipsum ipsum ipsum",
  //provide token after login in the headers to decode (that is, if using jwt NB: not in use) // provided in the req.session e.g "user_id": "6517fce61e818aabcbd245a4"
}

POST: COMMENT ON A POST
http://localhost:2023/comments/:post_id/create
e.g http://localhost:2023/65183de0f80a3054c1937086/create
{
  "body": "Deb's second comment on ebeleijeoma's first post lorem lorem lorem lorem ipsum ipsum ipsum ipsum",
  //provided in the req.session e.g "user_id": "6518358056e28fb77091a7c5",
  //provided in the url params e.g "post_id": "65183de0f80a3054c1937086"
}

POST: REPLY A COMMENT
http://localhost:2023/comments/:comment_id/reply
e.g http://localhost:2023/comments/651aa68ac5d298ea514ea1ec/reply
{
  "body": "Dad's first comment on Deb's fifth comment on ebeleijeoma's first post lorem lorem lorem lorem ipsum ipsum ipsum ipsum",
  //provided in the req.session e.g "user_id": "651947891ae4f52ed04c2cc0",
  //provided in the url params e.g "comment_id": "651aa68ac5d298ea514ea1ec"
}


GET

GET ALL USERS
http://localhost:2023/users
users is an array

GET A USER (BY ID)
http://localhost:2023/users/:user_id

GET ALL POSTS
http://localhost:2023/posts
posts is an array

GET A POST (BY IT'S ID)
http://localhost:2023/posts/:post_id

GET ALL POSTS OF A USER
http://localhost:2023/posts/user/:user_id
e.g http://localhost:2023/posts/user/6518356856e28fb77091a7c2

GET ALL COMMENTS ON A POST
http://localhost:2023/comments/:post_id/comments
e.g http://localhost:2023/comments/65183de0f80a3054c1937086/comments

GET ALL REPLIES TO A COMMENT
http://localhost:2023/comments/:comment_id/replies
e.g http://localhost:2023/comments/651aa68ac5d298ea514ea1ec/replies

GET COMMENT BY ID
http://localhost:2023/comments/:comment_id
e.g http://localhost:2023/comments/651ab1993ae38b78b27e097c

GET ALL OF A USER'S COMMENTS ON A POST
// must be logged in for the user_profile
http://localhost:2023/comments/:post_id/user
e.g http://localhost:2023/comments/65183de0f80a3054c1937086/user


PUT

PUT: UPDATE USER
// must be logged in for the user_profile
http://localhost:2023/users/profile

PUT: UPDATE POST
// must be logged in for the user_profile
http://localhost:2023/posts/:post_id

PUT: UPDATE COMMENT
// must be logged in for the user_profile
http://localhost:2023/comments/:comment_id


DELETE

DELETE: DELETE USER
// must be logged in for the user_profile
http://localhost:2023/users/delete

DELETE: DELETE POST
// must be logged in for the user_profile
http://localhost:2023/posts/:post_id/delete

DELETE: DELETE COMMENT
// must be logged in for the user_profile
http://localhost:2023/posts/:comment_id/delete
