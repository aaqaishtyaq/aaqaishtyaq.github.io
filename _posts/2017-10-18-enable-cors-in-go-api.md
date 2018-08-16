---
layout: post
title: How to enable CORS in your Go API
---

I just recently launched one of my latest personal projects, GoCatchEm. It's a
RESTful JSON API that returns stats information about all existing pokemons.
It's written in Golang using the Mux library.

I was extremely happy and relieved that I got to push it live and then I
realised, while testing it via my web browser that I had forgotten to enable
CORS.

CORS stands for Cross Origin Resource Sharing. It's a security mechanism that
ensures a user agent is only allowed access to selected resources on a different
origin (aka server). It does it through additional HTTP headers. It's not
problematic for images and stylesheets (which nowadays are mostly served through
Content Delivery Network) but is particularly relevant for scripts that make
HTTP requests ($.ajax / fetch ...).

This means that when I tried to use fetch to access some of my endpoints I'd get
an error back, which isn't acceptable, especially because this API is meant for
front-end prototyping.

Ok now, enough theory. Let's get down to business ! In this example, I'll be
using Mux.

To enable cors you first have to download a small package called handlers. To
put it simply, handlers are just a set of pre-baked middleware functions
(similar to what is used in Node.js for example).

To download the package just run the following command in your terminal.

```bash
go get github.com/gorilla/handlers
```

Then, all you have to do, is add the following to your main.go file. (or
whatever file handles the initialization of your app)

```go
import (
    // ...
    "github.com/gorilla/mux"
    "github.com/gorilla/handlers"
    "net/http"
    // ...
)

func main() {

    allowedHeaders := handlers.AllowedHeaders([]string{"X-Requested-With"})
    allowedOrigins := handlers.AllowedOrigins([]string{"*"})
    allowedMethods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"})

    // set up the router

    router := mux.NewRouter()
    router.HandleFunc("/", getHomePage).Methods("GET")

    // ... other routes here
    // ...

    http.ListenAndServe(":8989", handlers.CORS(allowedHeaders, allowedOrigins, allowedMethods)(router))
}
```

Notice we created three variables: allowedHeaders, allowedOrigins and
allowedMethods. The first one will append the X-Requested-With header to the
list of allowed headers from the clients. Allowed Origins is a list of allowed
domains to accept requests from (in this case we used to wildcard symbol to
denote that we want to accept requests from any domain. Feel free to edit this part
depending on your needs). Lastly, we list the allowed methods a client is able
to perform on our server using the AllowedMethods method via the
"Access-Control-Allow-Methods" header.

We then initialize the CORS method using `handlers.CORS` passing it our
handlers and call the function with our router as an argument.

All routes we add to our router will be able to use those handlers, so we're all
set !

Enjoy using CORS with Go !

If you learned something from this article, share it with your co-workers and
fellow hackers. If you notice any typo, error etc let me know on
[twitter](https://twitter.com/aaqaishtyaq).
