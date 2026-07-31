# Dev Tinder APIs

<!-- Auth router -->
-POST /Signup
-POST /login
-POST /logout

<!-- Profile Router -->
-GET  /profile/view
-PATCH /profile/edit
-PATCH /profile/Password

<!-- Connection Request Router -->
-POST /request/send/ignored/:userID
-POST /request/send/interested/:userID
-POST /request/review/accepted/:requestID
-POST /request/review/rejected/:requestID

<!-- User Router -->
-GET user/connections
-GET user/requests
-GET user/feed



