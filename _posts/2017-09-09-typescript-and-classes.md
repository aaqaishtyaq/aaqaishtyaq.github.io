---
layout: post
title: Fun with Typescript Classes
---

I have been reading and hearing about Typescript for the longest time. Praised
by all the hardcore nerds on HN, there wasn't a day where an article wouldn't
hit the front page (well that's a bit of an exaggeration, or is it ?). So I
decided to see for myself, and frankly I'm so happy I gave it a try.

Typescript has a long list of super useful features, which you can check out on
the official website, among which is support for classes. (I also forgot to
mention that it's the default 'language' used by Angular 2/4).

Classes in Typescript are more flexible than in ES6. It allows for much more
poweful behaviour. In the post below, I've combined some of the neat things I
learned along the way.

_Note: This post will be updated with your suggestions/remarks as well as other
tricks I learn as I get more and more comfortable using the tool and the
constructs it provides_

## Private Methods and Properties

If you don't know what private methods and properties are, they are essentially
protected. Meaning they can't be called directly after the class has been
instantiated.

You can define a method or property as being private simply by
prepending it with the `private` keyword. It's also good practice to start the
property/method name with an underscore, to denote that's it's private. (That
way, when you're scanning your or somebody else's code, you can cleary recognize
which variable is private or public.)

The opposite of private is public. Public properties are accessible directly but
the downside is that you can accidenty change the values which can cause
unexpected behaviour/errors. So be careful with that.

Here's an example below :

```typescript
class Pokemon {

    public name: string;
    private _area: string;

    constructor(name, area) {

        this.name = name
        this._area = area
    }

    // methods
    public sayArea(): string {

        return `Hey I'm ${this._shoutName}, and I'm from ${this._area}`
        // _area and _shoutName() are accessible from within the class
        // but not outside (see below)
    }

    private _shoutName(): string {
        return this.name + "!!!!"
    }

}

let pikachu = new Pokemon("Pikachu", "Kanto")

console.log(pikachu.name) // Pikachu
console.log(pikachu.sayArea()) // Hey I'm Pikachu and I'm from Kanto

console.log(pikachu._area) // Error
console.log(pikachu._shoutName()) // Error
```

If we compile and run the file we get the following output:

```bash
classes.ts(65,21): error TS2341: Property '_area' is private and only accessible
within class 'Pokemon'.
classes.ts(66,21): error TS2341: Property '_shoutName' is private and only
accessible within class 'Pokemon'.
```

## Constructor Properties

Typescript let's you define properties straight from the constructor. That way
you don't need to use the `this.prop = prop` syntax inside your constructor.

Example below:

```typescript
class Pokemon {

    public name: string;
    private _area: string;

    constructor(name, area, public level?: string) {

        this.name = name
        this._area = area
        // notice we don't need to set this.level = level in the constructor
    }

    // methods

    public sayLevel(): string {

        if(!this.level) {
            return "I don't even know man"
        }

        return `I am level ${this.level}`
    }

    // other methods ...

}

let pikachu = new Pokemon("Pikachu", "Kanto")
let natu    = new Pokemon("Natu", "Johto", 23)

console.log(pikachu.sayLevel()) // I don't even know man
console.log(natu.sayLevel()) // I am level 23
```

## Static Methods and Properties

If you're familiar with Python programming, static methods are essentially
equivalent to using the `@classmethod` decorator. If you don't know python, this
means that a static method or property is only accessible by the class itself
and not its instances.

In the example above, we create a static property to record how many pokemons
were created. The value of `TOTAL_POKEMONS` is incremented by 1 every time a new
Pokemon instance is created.

```typescript
class Pokemon {

    public name: string;
    private _area: string;
    public static TOTAL_POKEMONS: number = 0

    constructor(name, area, public level?: string) {

        this.name = name
        this._area = area
        Pokemon.TOTAL_POKEMONS++ // We increase the total number of pokemon each time a new pokemon is created
    }

    // methods
    // ...
}

let pikachu = new Pokemon("Pikachu", "Kanto")
console.log(Pokemon.TOTAL_POKEMONS) // 1

let natu    = new Pokemon("Natu", "Johto", 23)
console.log(Pokemon.TOTAL_POKEMONS) // 2

console.log(pikachu.TOTAL_POKEMONS) // error
console.log(natu.TOTAL_POKEMONS) // error
```

If we run the file, we get following compiliation errors:

```bash
classes.ts(81,21): error TS2339: Property 'TOTAL_POKEMONS' does not exist on
type 'Pokemon'.
```

## Getters and Setters

Continuing with the python analogy, getters and setters behave the same way as
the `@property` and `@prop_name.setter` decorators. They are essentially methods
that will return or set values for given properties on your class. This allows
you to have private property that you expose only with these methods. The cool
thing about this is the syntax is the same as if you were calling an actual
property.

Confused much ? Here's an example:

```typescript
class Pokemon {

    public name: string;
    private _area: string;
    private _trainerName: string;

    constructor(name, area, trainerName?) {

        this.name = name
        this._area = area
        this._trainerName = trainerName
    }

    public get trainerName(): string {
        if (!this._trainerName) {
            return "New phone, who dis ?"
        }
        return this._trainerName
    }

    public set trainerName(newTrainerName: string) {
        this._trainerName = newTrainerName
    }
}

let pikachu = new Pokemon("Pikachu", "Kanto", "Ash")
console.log("My trainer ? ", pikachu.trainerName) // Ash
pikachu.trainerName = "Brock" // setter
console.log("My trainer ? ", pikachu.trainerName) // Brock (this would never happen but let's just pretend)
```
That's it for now ! I can't recommend Typescript enough so try it out and see
for yourself. It's a must if you're going to work on a angular 2/4 codebase, but
even if you don't, it instills good software practices like type checking and
other things !

If I made horrible mistakes, typos and such, @ me on twitter I'm
[@aaqaishtyaq](https://twitter.com/aaqaishtyaq)
