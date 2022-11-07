# backend-mongodb

# Table of Contents

- [Schema](#schema)

- [CRUD](#crud)

- [Polulate](#populate)

- [ORM >< Driver]()

- [BSON](#bson)

## ModalLink

- [Design Relationship](#)

- [Compare Mongodb >< SQL](#)

- [Index ? Aggregation](#)

## [Reference](https://university.mongodb.com/)

## Schema

For create a  object to match a colecction in database at mongodb

Schema Type:

- String:lowercase,uppercase,trim,match,enum,
- Number: min, max,
- Date: date.now(),
- Buffer:To declare a path as a Buffer, you may use either the Buffer global constructor or the string 'Buffer'.

    ```js
    const file1 = new Data({ binData: 'test'}); // {"type":"Buffer","data":[116,101,115,116]}
    const file2 = new Data({ binData: 72987 }); // {"type":"Buffer","data":[27]}
    const file4 = new Data({ binData: { type: 'Buffer', data: [1, 2, 3]}}); // {"type":"Buffer","data":[1,2,3]}
    ```

- Boolean: True ,false
- Mixed: can define a mixed path using Schema.Types.Mixed or by passing an empty object literal.
- Objectid
- Array:  ten:[String]
- Decimal128
- Map: maps are how you create a nested document with arbitrary keys.

    ```js
    exmaple for map:
    const userSchema = new Schema({.
        socialMediaHandles: {
        type: Map,of: String
        }
    });
    
    const User = mongoose.model('User', userSchema);
    // Map { 'github' => 'vkarpov15', 'twitter' => '@code_barbarian' }
    console.log(new User({
        socialMediaHandles: {
        github: 'vkarpov15',
        twitter: '@code_barbarian',
        }
    }).socialMediaHandles);
    ```

--> diem khac nhau khi tao schema dung array la gi

Note : To use Schema  we need tranfer to model

Create new Model with information at Schema.Can skip some value.

```js
    new User({
        Ten :'Le Minh Hieu',
        Ngaytao: 1999-06-15,
    })

    // in colection is
        // Ten :'Le Minh Hieu',
        // Ngaytao: Date.now(),
        // Tuoi :20
```

## All Schema type

- **${\color{orange}require}$**  : (boolean or function), if true adds a required validator  for this property
- **${\color{orange}default}$** : sets a default value for the path. If the value is a function, the return value of the function is used as the default.
- **${\color{orange}select}$**: boolean, specifies default projections for queries
- **${\color{orange}validate}$**: adds a validator function
- **${\color{orange}get}$** :function, defines a custom getter for this property using Object.defineProperty().
- **${\color{orange}set}$** : same get
- **${\color{orange}alias}$**:
- **${\color{orange}immutble}$**:
- **${\color{orange}transform}$** :

 ```js
    const numberSchema = new Schema({
    integerOnly: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        alias: 'i'
    }
    });

    const Number = mongoose.model('Number', numberSchema);

    const doc = new Number();
    doc.integerOnly = 2.001;
    doc.integerOnly; // 2
    doc.i; // 2
    doc.i = 3.001;
    doc.integerOnly; // 3
    doc.i; // 3
 ```

[back to top](#backend-mongodb)

## CRUD

(Create,Read,Update,Delete)

1. Create Operations
    Create or insert operations add new documents to a collection. If the collection does not currently exist, insert operations will create the collection.  
    - insertOne
    - inserMany

    ```js
    //inserMany
        db.users.inserOne({
        name:"sue",
        age:26,
        status :"pending"
    })
    ```

2. Read Operations

    Read operations retrieve documents from a collection; i.e. query a collection for documents

    ```js
    db.users.find(
        {age:{$gt:18}},
        {name:1,address:1}
    ).limit(5)
    ```

3. Update Operations

    Update operations modify existing documents in a collection.
    - updateOne()
    - updateMany()
    - replaceOne()

    ```js
     db.users.updateMany(
        {agr:{$lt:18}},
        {$set:{status :"reject"}}
     )
    ```

4. Delete Operations

    Delete operations remove documents from a collection.

    - deleteeOne()
    - deleteMany()

    ```js
    db.users.deleteMany({
        {stauts:"rejetct"}
    })
  
    ```

5. Find

    - **findONe**
    - **findONeAndDelete**: deletes the first matching document in the collection that matches the filter.
    - **findONeAndRemove**
    - **findONeAndReplcae**
    - **findONeAndUpdate**

[back to top](#backend-mongodb)

## Populate

Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s)
```js
    Story.
  findOne({ title: 'Casino Royale' }).
  populate('author').
  exec(function (err, story) {
    if (err) return handleError(err);
    console.log(story);
  });
```

Mongoose populate doesn't behave like conventional SQL joins. When there's no document, story.author will be null

```js
    await Person.deleteMany({ name: 'Ian Fleming' });

    const story = await Story.findOne({ title: 'Casino Royale' }).populate('author');
    story.author;

```

What if we only want a few specific fields returned for the populated documents

```js
    Story.
    findOne({ title: /casino royale/i }).
    populate('author', 'name'). // only return the Persons name
    exec(function (err, story) {
        if (err) return handleError(err);

        console.log('The author is %s', story.author.name);
        // prints "The author is Ian Fleming"

        console.log('The authors age is %s', story.author.age);
        // prints "The authors age is null"
    });
```

Only the last one will take effect when we want populate multiple paths at the same time


```js
    Story.
    find().
    populate({ path: 'fans', select: 'name' }).
    populate({ path: 'fans', select: 'email' });
    // The above is equivalent to:
    Story.find().populate({ path: 'fans', select: 'email' });
```

We can also add options and queries

```js
Story.
  find().
  populate({
    path: 'fans',
    match: { age: { $gte: 21 } },
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    select: 'name -_id'
  }).
  exec();
```

Populating across multiple levels

```js
    User.
    findOne({ name: 'Val' }).
    populate({
        path: 'friends',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: 'friends' }
    });
```

populating multipe database

```js
    const db1 = mongoose.createConnection('mongodb://localhost:27000/db1');
    const db2 = mongoose.createConnection('mongodb://localhost:27001/db2');

    const conversationSchema = new Schema({ numMessages: Number });
    const Conversation = db2.model('Conversation', conversationSchema);

    const eventSchema = new Schema({
    name: String,
    conversation: {
        type: ObjectId,
        ref: Conversation // `ref` is a **Model class**, not a string
    }
    });
    const Event = db1.model('Event', eventSchema);
```

**Dynamic References via `refPath`:**
Mongoose can also populate from multiple collections based on the value of a property in the document

```js
const commentSchema = new Schema({
  body: { type: String, required: true },
  on: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    required: true,
    enum: ['BlogPost', 'Product']
  }
});

const Product = mongoose.model('Product', new Schema({ name: String }));
const BlogPost = mongoose.model('BlogPost', new Schema({ title: String }));
const Comment = mongoose.model('Comment', commentSchema);
```

## ORM >< Driver

1. ORM : object relational mapping

    is a programming technique for converting data between incompatible type systems using object-oriented programming languages.  

    ![orm](../backend-mongodb/img/orm.png)
2. Driver: (ODM - Objec Data Model)

    ![orm](../backend-mongodb/img/mongo.png)

## BSON

## Design Relationship

## Compair Mongodb >< SQL

 ![orm](../backend-mongodb/img/compari.png)

## Index ? Aggregation
