# A web application which uses MongoDb,Express,React, NodeJs, and the passport library for authentication
#### The purpose of this app is to learn the initial steps in setting up a web application

## Application technologies

1. NodeJs
2. Mongoose/MongoDb
4. Express
3. React

### Things to note

1. This is one of my first Web applications so by take everything in here with a grain of salt.
2. I wrote this code soley for the purpose of learning and becoming better at the MERN stack.
3. I will explain as much as I can, especially when it comes to the gotchas ;)

## Backhand
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

### Putting it together

1. Import all of the above dependencies into app.js
2. Create a basic server with express
3. Make a routes folder with aptly named route files(Using express-router import)
4. Import the routes into app.js
5. Make a models folder for mongoose models
6. Add whatever files you

### Configure mongo databse


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



### Mongoose schemas

Creating a schema is a bit like like creating a blueprint for your data. It dictates the structure of data once it is placed in the mongo database. Zooming out a bit, the structure of a mongo database is: A database has collections, collections have documents, and documents are where the data is actually stored. The schema you create will dictate how each new document is structured when it is created. Here are some common patterns used when creating a schema.

1. Embed data
    - Simplest way to store data, good for data that is accessed together, just one parent document with many fields.

2. Reference
    - This involves 2 schemas. Two different collections are created, one for each type of schema. A reference field can then be set which will contain the ObjectId of the thing you want to reference. They could both reference each other, or just one of them reference the other. This reference technique can then be taken a step further to include an array of references. This allows one object to point to a bunch of other objects. This might seem like a good idea when initially creating your schemas, but beware, it comes with increased complexity when querying, adding, or deleting from the database. With that said, we are going to use one schema and simply embed data for now.

### Mongoose queries

Here are some tips I learned for querying embedded data

1. When updating arrays, do not try to do it in one query.

    I recommend querying with the `const user = await findOne(_id)` and then
    using the `user.friends.push({name:"YAH BOI"})`. Once the friend is pushed onto the array, finish it off with a good ole `user.save()` to add that change to the database.

For a simple web app like the one im creating here, I am simply goi
## Front Hand