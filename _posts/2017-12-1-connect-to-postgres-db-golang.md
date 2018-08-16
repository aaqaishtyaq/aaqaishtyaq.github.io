---
layout: post
title: Connect your Go app to PostgreSQL
---

I like Golang, I really do. I also very much like Postgres as a database engine.
You probably do too. So I'm going to show you how to use your favorite language
to connect and interface with your favourite DB engine. You can thank me later.

## Download The PostgresSQL driver.

Golang comes bundled with a package called "database/sql" which, as its name
implies, deal with databases and more specifically SQL type databases. So we'll
need this in order to connect to our DB. This package relies on a specific
driver to work with postgres. It doesn't come with the standard library so we
need to download it.

Fire up a terminal and run the following command:

```bash
go get -u github.com/lib/pq
```

## Connect to the database

If you haven't already, take a couple of minutes to create a database
using either the postgres shell (or whatever GUI application you happen to use)
and keep note of the credentials (database name, password, host,
port, username...)

Once you've got everything ready, create a file and paste the following code in
it:

```go
package main

import(
    "os"
    "database/sql"
    _ "github.com/lib/pq"
)

const (
    user        = os.Getenv("DB_USER"),
    password    = os.Getenv("DB_PASS"),
    dbname      = os.Getenv("DB_NAME"),
    host        = os.Getenv("DB_HOST"),
    port        = os.Getenv("DB_PORT"),
)

dsn := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%s", user,
password, dbname, host, port)

db, err := sql.Open("postgres", dsn)

if err != nil {
    panic(err)
}

defer db.Close()

err = db.Ping()

if err != nil {
    panic(err)
}

fmt.Println("Connection established")
```
Let's go through what this piece of code does :

First, we import the necessary packages. Notice the use of the underscore in
front of the postgres import statement. This tells the compiler to ignore the
fact that we don't explictly call it in our code (otherwise it raise an error)

Next, we setup our constants with our database credentials. Here, the os package
is used to retrieve the previously declared as environment variables. This is a
good approach as we don't want to hard code the values and have them accessible
via version control for example.

Then we create the connection string using `fmt.Sprintf`.

After that, we establish the actual connection by calling `sql.Open`
passing it the name of the engine (in this case, "postgres") along with our
connection string. This method returns an instance of our database, or an error
if there is one.

In case an error occurs, we panic and we return the error message.

Finally, we defer the call to db.Close() because we don't want to keep the
connection open after we exit the program.

Optionally, we can call db.Ping() which will ping the database to see if there's
a response. This is good if you absolutely want to ensure that a DB connection
was established.

So there you have it ! You should now be able to use Go with Postgres to build
the apps of your dreams.

If I've missed something, made a horrible mistake of if you have any questions
regarding this article then feel free to ping me on Twitter. I'm
[@aaqaishtyaq](https://twitter.com/aaqaishtyaq).
