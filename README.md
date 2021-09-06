# Web app using MongoDb,Express,React, NodeJs, and the passport package for authentication

## Application technologies

1. NodeJs
2. Mongoose/MongoDb
3. Express
4. React

### Things to note

1. This is one of my first Web applications so by take everything in here with a grain of salt.
2. I wrote this code soley for the purpose of learning and becoming better at the MERN stack.
3. I will explain as much as I can, especially when it comes to the gotchas ;)

## ***Back-hand***

Lets start off with express and setting up routes which will work with postman.

Start small. Getting the basics to work is key.

What is essential for starting to make an express app?

- nodemon - Allows automatic server restart upon saving a file
- morgan - Prints out any request sent to the server(with varying leveles of information)
- mongoose - Makes working with MongoDb easier
- express(I hope) - Allows us to locally host a server for development
- cors - (Cross-origin-resource-sharing) -  [Cors](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- dotenv - Set up environment variables

All of these are npm packages and can be downloaded with this command

    npm install morgan mongoose express cors dotenv

I would install nodemon globally, because that way you can use it in other projects without having to reinstall it.

    npm install -g nodemon

Boom basic backend dependencies done.

### **Putting it together**

1. Import all of the above dependencies into app.js
2. Create a basic server with express
3. Make a routes folder with aptly named route files(Using express-router import)
4. Import the routes into app.js
5. Make a models folder for mongoose models
6. Add whatever files you

---

### **Configure mongo databse**

There are two options here:

1. Mongo's online free version

    Pros: Gets you familiar with the UI, easy to set up
    Cons: Online so you have to wait slightly longer

    [Atlas](https://www.mongodb.com/cloud/atlas/lp/try2?utm_content=controlaterms&utm_source=google&utm_campaign=gs_americas_mexico_search_core_brand_atlas_desktop&utm_term=free%20mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624326&gclid=Cj0KCQjwssyJBhDXARIsAK98ITQsGw-K3EP6HVeon8L9Ou9eddNxGwHzmUBaVsBXmykXelyTBj7umnIaAtPlEALw_wcB)

2. Download Mongo locally

    Pros: Infinite space and super fast
    Cons: Harder to set up, install third party database viewer( or just use compass)

    [Local setup](https://www.youtube.com/watch?v=MCpbfYvvoPY)

    [Data viewer(Robo3T)](https://robomongo.org/)


---

### **Mongoose schemas**

Creating a schema is a bit like like creating a blueprint for your data. It dictates the structure of data once it is placed in the mongo database. Zooming out a bit, the structure of a mongo database is: A database has collections, collections have documents, and documents are where the data is actually stored. The schema you create will dictate how each new document is structured when it is created. Here are some common patterns used when creating a schema.

1. Embed data
    - Simplest way to store data, good for data that is accessed together, just one parent document with many fields.

2. Reference
    - This involves 2 schemas. Two different collections are created, one for each type of schema. A reference field can then be set which will contain the ObjectId of the thing you want to reference. They could both reference each other, or just one of them reference the other. This reference technique can then be taken a step further to include an array of references. This allows one object to point to a bunch of other objects. This might seem like a good idea when initially creating your schemas, but beware, it comes with increased complexity when querying, adding, or deleting from the database. With that said, we are going to use one schema and simply embed data for now.

---

### **Mongoose queries**

Here are some tips I learned for querying embedded data

1. When updating arrays, do not try to do it in one query.

    I recommend querying with the `const user = await findOne(_id)` and then
    using the `user.friends.push({name:"YAH BOI"})`. Once the friend is pushed onto the array, finish it off with a good ole `user.save()` to
    add that change to the database.

2. Updating an array with an array

    Same thing as above, but when you go to update the array use the `$each`
    `user.details.profession.push({ $each: profession });`
    > profession is an array of strings here

---

### **.env file**

This file great cor constants throughout your application. These can be things such as:

- Urls
- JWT secrets
- Amounts of time
- And strings that you want to keep around

Word of warning, make sure to include this in your .gitignore file so you dont accidentally upload all your secrets :)

---

## **Authentication with passport**

Oh boy you're in for a treat!

> This is only my second time setting up authentication, so it might seem a little thrown together!

### **Install dependencies**

    npm install passport passport-jwt passport-local passport-local-mongoose jsonwebtoken cookie-parser

#### **Authetication structure**

I will be using a jsonwebtokens(JWT) to verify if a user is who they say they are. More specifically, there will be two JWT's.

- token = A token JWT which is sent directly to the user upon login, has a short validity time(15mins)

- refreshToken =  a basic JWT, which is sent as a SIGNED cookie to the user upon login, has a longer validity time(1 month)

These are the names for these two individual things for the rest of this post.

The difference between these two is very important, as they can seem like the same thing when you're not looking too closely.

#### **Quick Rundown on how the JWT's are going to be created**

Each JWT is created with a payload. This payload is baked into the final token, and gets encryted. Upon decryption of the JWT, this payload is
then revealed. For this application, the payload is going to look like the following: `{_id:usersIdInDatabase}. Because the users id is baked
into the JWT upon creation, it is available once decrypted.

Back to authentication structure.

Once the user logs in with good credentials, they recieve a newly minted token in the response body. Once the token is created, it is valid for 15 minutes. The validity time of this token is purposefully set to be short so that in the event of a hack, the token can only be used for a short window.

This presents a problem though, because if the user only has a token for 15 minutes, they are going to have to log back in, and get a new token all the time.

Enter refreshToken. Upon login, a refreshToken is also created. This token is then stored in the database as a JWT token. In order to get the token to the user, it is sent as a signed cookie. A signed cookie is signed using a cookie secret(I chose this secret and stored it in the .env file) and can only be decrypted by the owner of the cookie secret. Now any modification of this cookie can be detected. 

 ***If this cookie is stolen, it can then be used to get a new refreshToken and token***

Lucky, by using httpOnly:true in the cookie configuration, this cookie will only every be exposed to the server from which it originated. So if the client side is subject to an XSS attack, this cookie will be protected.

This is not optimal, but it works for a low security application.

To increase security, a method to invalidate refreshToken should be added eventually.

Now, with the token expired and the refreshToken waiting in the browser, all it takes is a simple request to a /refreshToken endpoint to get a new token and refreshToken.

The server will recieve the refreshToken, check that it has not been tampered with, then use the decrypted payload from the refreshToken to query the database for a user. If the user exists, create a new token, refreshToken(with the user  id baked into each one) and respond with both.

### **Authentication Strategies**

There are two authentication strategies being used in this project, the local strategy, and the jwt strategy.

1. Local:

    This strategy is used to authenticate a user based on a username and password provided. *Only used on login*

2. Jwt:

    This strategy checks the req.headers.Authorization header for the token the logged in user should have.
    *Used when accessing protected routes*

#### **Logout**

When a user goes go logout, there are two things to do server side.

1. Invalidate the refreshToken in the users browser
2. Delete the refreshToken in the database.

The one caveate with deleting refreshTokens upon login and logout is that if the user logs in from multiple devices, they will only be authenticated on device first logged into until their token expires. This would require them to log back in, and then have the cycle repeate for the other device.
This is certainly a place to improve!

### **Signup****

The signup route uses the handy passport-local-mongoose package to register a user into the database. All that is required to register a user in the database is this line of code.

    const user = await User.register({ username: username, firstName: firstName },password);

The passport-local-mongoose package graciously generates a unique salt and uses it to encrypt the password provided. I choose to make the first name required in my mongoose schema, so it had to be included upon creation of a new user.Additionally, this route also generates the users first token and refreshToken so that they are logged in straight away.

### **Login**

The login route is brought to us by the passport-local package. This strategy simply allows us to send the username and password in the req.body, and then this line of code takes care of validating that this user exists

    passport.use(new LocalStrategy(User.authenticate()))

In this middleware,
if the provided username and password combo match a user in the databse, the matched user _id will be appended to the req.user field and execution onto the logic specified in the route.

Otherwise it throws an error and the user is not authenticated.

### **Cookies.**

### **Protected routes**

Since this application is dependent on a user being logged in to actually use the application, it is important to protect routes so that only logged on users can access them.

Aside from the login/register route, and maybe the front landing page, everything else will be protected.

I am going to implement this protection using the passport-jwt package.

    exports.verifyUser = passport.authenticate("jwt",{session:false})

The passport-jwt authentication strategy expects a Jwt the token to validate and the secret the token was created with. This validation should be run as middleware every time a use requests access to a protected route.

Alright! That will do it for the backend.

---

## ***Front-Hand***

The front end of this application was built with React and tailwindcss.

The thing that gave me the most difficulty on the front end was devising a way to manage the users login state and refect that in the pages they were allowed to view. I also ran into an extremely time consuming axios bug which I will explain in this section.


### **State Management**

Being my first month learning React, I was/am unaware of the best practices when it comes to state management. I tried a package called [jotai](https://www.npmjs.com/package/jotai) to manage my state, but never really got it to work the way I wanted it to(If I went back now I could prbably do it just fine). So instead I used UserContext. This enabled me to manage the state of a users authentication in any component I choose, and work pretty seemlesly. Now once the user was authenticated, I had to do something  with that information. This is where I spent most of my time.

### **React-Router**

Early on in my quest to solve the page view problem, I remembered a library a friend had told me about: react-router. I quickly installed it and rushed to implement it. This was a mistake. I had no clue what I was doing and ended up spending so much time debugging code that was never gonna work. It wasnt until I discovered [Pedro Techs Video](https://www.youtube.com/watch?v=qnH5KNtRYEI) on protected routes in react-router that I finally understood what to do.

The solution was to create a protected route component which took in a component. The protected route component then had a route in it which would either load the component if the user was logged in, or redirect them to the login page if they were not.

### **Axios BUG**

This bug took me three days to find. [Here it is](https://stackoverflow.com/questions/68977915/post-request-from-axios-always-returns-unauthorized-despite-having-valid-jwt-set/68988925#68988925):

Axios deletes all headers with this format-

    const fetchProfileDetails = async(config)=>{
    const res = await axios.POST("http://localhost:8080/users/me", config)
    }

    const config = {
        method:"POST",
        withCredentials: true,
        headers: {Authorization: `Bearer ${userContext.token}`}
    }

But does not delete headers in this format-

    const res = await axios({
    method:'POST',
    url:"http://localhost:8080/users/test",
    headers:{'Authorization':`Bearer${token}`}})

[FH/BH](https://www.youtube.com/watch?v=iGAMbNKcN1U)