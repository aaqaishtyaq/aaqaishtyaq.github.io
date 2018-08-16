---
layout: post
title: Javascript Arrays and Functional Programming
---

I spent most of the last couple months drowned in python land.
And while it was a nice and enjoyable ride, I decided to come back to my first
love: javascript. (hard to believe I know)

In this article, I'll be exploring functional programming concepts applied to
js, and more specifically to arrays.

When we talk about functional programming in JS, three functions come to mind:
`map`, `filter` and `reduce`. So let's dive in and explain what they do and how
they work.

To illustrate the following examples, I will work with an Array of objects
containing information about **real fooball** players.

```javascript
let footballPlayers = [
 {gender: "M", name: "Karim Benzema", age: 29, club: "Real Madrid CF", country: "Spain"},
 {gender: "M", name: "Samir Nasri", age: 29, club: "Sevilla FC", country: "Spain"},
 {gender: "M", name: "Hatem Ben Arfa", age: 29, club: "PSG", country: "France"},
 {gender: "M", name: "Radamel Falcao", age: 27, club: "AS Monaco FC", country: "France"},
 {gender: "M", name: "Riyad Mahrez", age: 25, club: "Leicester City FC", country: "England"},
 {gender: "M", name: "Sofiane Feghouli", age: 26, club: "West Ham United", country: "England"}
]
```

## Array.prototype.map

Array.prototype.map takes a function with the current array item as an argument.
It will essentially loop through the array it's called on and will return a new
array with the results of the function.

That was confusing I know, so let's look at an example: suppose we wanted to
create an array from the original one with only names and ages as object keys,
this is how we'd achieve it:

```javascript
let namesAndAges  = footballPlayers.map( player => {
   return {name: player.name, age: player.age }
})
```
If we console.log the namesAndAges we get:

```bash
[ {name: "Karim Benzema", age: 29}, {name: "Samir Nasri", age: 29} ] # ...
```

_Note: the length of the new array will always be equal to the length of the
original one. If you have an array of 7 items, calling map on it will return an
array of 7 items_

## Array.prototype.filter

Just like map, filter takes a function with the current array item as its
argument. And just like map, filter returns a new array. Only in this scenario,
the new array will contain items that pass a specific test declared in the
function.

Example: Let's filter out all players younger than 27 years old.

```javascript
let oldPlayers      = footballPlayers.filter( player => player.age >= 27 )
```
With ES6, we can even do this using one-liners. Isn't it sweet ? Purists will
certainly appreciate that.

Our test returns a boolean, if it's true the item is pushed to the new array
else it's skipped and the loop continues to the next item. (In the above
example, we're testing player.age to check if it's greater than 27)

## Array.prototype.reduce

Now we get into the cool stuff. With reduce you can turn an array into
absolutely anything you want. It takes two arguments, a function and what is
called an accumulator (which will store the result of the function executed at
each pass through the array). This accumulator can be an array, an object, a
number (if you want to calculate a sum for example) or almost anything really.

Example: Let's transform this array into an object with players sorted by
country.

```javascript
let playersByCountry = footballPlayers.reduce( (players, player, index) => {

    if (player.country == "France") {
       players.france.push(player)
    }
    else if (player.country == "England") {
        players.england.push(player)
    }
    else if (player.country == "Spain"){
        players.spain.push(player)
    }

    return players

}, {france: [], england: [], spain: []} )

```
A few things to note:

The function takes 3 arguments: A reference to the accumulator
(some people use the word `all` to describe it), the current item being iterated
over and its index.

We must always return the accumulator so that at every pass we have an accurate
representation of the final return value.

## Other Nuggets

### Array.prototype.every

Will return true if **every single item** being iterated over passes a test, if
as much as one fails, it returns false.

Example: Check that every single player is male (no sexism here, promise)

```javascript
let allMales    = footballPlayers.every( player => player.gender === "M" )
```

### Array.prototype.some

Will return true if **some** of the items in the array pass a certain test. It
only returns false if **none** pass it.

```javascript
let over25      = footballPlayers.some( player => player.age > 25)
```

## Conclusion

Functional programming is a great tool and will drastically improve your productivity
as well as make your code cleaner, leaner, and more readable. (Try doing a
filter with for loops !)

There's a lot more that can be done with arrays in Javascript, I'll probably write
an article on the other neat, magical methods that js offers to manipulate them.

Questions ? Found a Typo ? Spotted a mistake ? I'm
[@zabanaa](https://twitter.com/aaqaishtyaq) on twitter.
