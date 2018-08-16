---
layout: post
title: "Async/Await: A basic Introduction"
---

With ES6, Promises were introduced to rescue us from what used to be called "the
callback christmas tree of sorrow" and we're all greatful for that. Last June,
TC39 (the javascript warlords, if you don't know them) officially released the
spec for the next version of Javascript: ES7 (or ES Next, or ES2017, or whatever
really). This new release comes packed with a tonne of the new exciting
features, including the one we're interested in: async/await.

This feature offers a new way of addressing asynchronous tasks. It's already
natively supported  in Node.js version 8 and on the front end using a transpiler
like babel (acccording to random people on the dub-dub-dub [WWW], it doesn't
compile efficiently, so if performance is a concern, which it should be, I
would advise against doing anything in production)

Important note: this article assumes existing knowledge of asynchronous
programming constructs and prior experience using Promises (both will help you
grasp the concept and differences between the two approaches)

## Scenario

To illustrate said differences, we need a scenario: Your boss wants you to
collect data about cyberpunk novel characters (Why not ?). Thankfully, I've
built a RESTful API just for that purpose, it's called [ wintermute ][0]. We'll use
it along with [node-fetch][1] for making HTTP requests.

*Note: This code will run inside a Node.js (v8.3.0) environment.*

Ready ? Let's dive in !

### With Promises

Below is an example of how we would achieve our task using the normal Promise
construct (ES6).

```javascript
const fetch = require("node-fetch")
const url   = "https://wintermute.design/api/characters"

function getAllCharacters() {

    return fetch(url)
        .then( response => response.json() )
        .then( data => console.log(data.characters) )
        .catch( err => console.error(err) )
}

getAllCharacters() // Will log the expected data
```

"So what's wrong with this piece of code ?", I hear you asking. Well nothing
really. Now what if your boss asks you to get the associated novel for a character ?

The code would now look like this:

```javascript
const fetch = require("node-fetch")
const url   = "https://wintermute.design/api/characters"

function getNovelInfo() {

    return fetch(url)
        .then( response => response.json() )
        .then( data => {

            const molly         = data.characters[2]
            const novelId       = molly.novelId
            const novelInfoUrl  = "https://wintermute.design/api/novels/${novelId}"
            // Replace the quotes with backticks (``)for this to work

            return fetch(novelInfoUrl)
                .then(response => response.json())
                .then(novel => console.log(novel))

        })
        .catch( err => console.error(err) )
}

getAllCharacters() // Will log the expected data
```
Now it's getting a little bit more confusing, just imagine having to repeat the
process 2 or more times.

### With Async/Await

Let's look at how we can do the same thing with async/await:

```javascript
const fetch = require("node-fetch")
const url   = "https://wintermute.design/api/characters"

async function getAllCharacters() {

    const response      = await fetch(url)
    const responseBody  = await response.json()
    return responseBody.characters
}

(async function() {
    const allCharacters = await getAllCharacters()
    console.log(allCharacters) // Will log the expected data
})()

```
This is easier to reason about, primarily because it reads like normal
synchronous code.

A few things to note: async functions must always be prefixed with the `async`
keyword and the `await` keyword can only be used and understood within the context
of an async function.
In this example the `await` declaration will wait until the Promise returned by our
fetch call is resolved and will store the content in the `response` variable.
Same thing for the line below, since `response.json()` also returns a Promise.

**Hold on ! What's up with that self invoking anonymous function at the end ?**

Well, as I mentioned above, it's impossible to use the await keyword outside on
an async context. Doing this for example wouldn't work:

```javascript
const allCharacters = getAllCharacters() // will just return a promise to be resolved using .then()

const allCharacters = await getAllCharacters() // will throw an error for the reason explained above
```

To access the data returned by our async function we must call await inside an
async function. It will make more sense in the next example.

Let's refactor the second example where we extract the novel data for a specific
character:

```javascript
const fetch = require("node-fetch")
const url   = "https://wintermute.design/api/characters"

async function getAllCharacters() {

    const response      = await fetch(url)
    const responseBody  = await response.json()
    return responseBody.characters
}

async function getNovelInfo() {

    const characters        = await getAllCharacters()
    const molly             = characters[2]
    const novelInfoUrl      =
    "https://wintermute.design/api/novels/${molly.novelId}"
    // Again, replace the quotes with backticks (``)

    const novelInfoResponse = await fetch(novelInfoUrl)
    const novelInfo         = await novelInfoResponse.json()

    return novelInfo
}

(async function() {
    const novelInfo = await getNovelInfo()
    console.log(novelInfo) // Will log the expected data
})()
```

See ? We've now split our logic into two separate async functions. It allowed
us to call `await` on `getAllCharacters` and manipulate the data like we wanted.
Also notice the lack of nesting here, which significantly improves readability.

### Error Handling

But what about error handling ? If you look up the first example using Promises,
you can see that we used the `.catch()` method to capture errors if, for whatever
reason, the Promise didn't resolve.

Part or what makes async/await so exciting is that it uses normal javascript
constructs.
In this case we can simply wrap our functions inside a `try/catch ` block, like so:

```javascript

// ... your code here

(async function() {

    try {
        const novelInfo = await getNovelInfo()
        console.log(novelIndo)
    }
    catch(err) {

        if(err.errno === "ENOTFOUND") {
            console.error("This endpoint does not exist, Please check the URL")
        }
    }
})()

```
And BAM ! Job done !

## Conclusion

Async/Await is going to make asynchronous programming easier to reason about
for intermediate/advanced programmers and help get beginners on board quicker.
Also, if you're coming from a language that handles async tasks natively (like
golang), you'll be right at home.

If you've made it this far, thanks for reading ! If you spot anything that
should be corrected, hit me up on twitter I'm [@zabanaa](https://twitter.com/zabanaa).

As always: stay cyber, stay punk.

[0]: https://wintermute.design
[0]: https://www.npmjs.com/package/node-fetch
