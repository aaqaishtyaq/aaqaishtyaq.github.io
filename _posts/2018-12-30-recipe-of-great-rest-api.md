---
layout: post
title: The Recipe of a great RESTful API
---

I personally love writing APIs, it's my favourite thing about backend
development. As developers we interact with APIs all the time, to
process payments with stripe, for geolocation with google maps, to retrieve
tweets etc ...

So what exactly makes a RESTful API great ? What can you do to
ensure that it's easy to use for other developers ? Let's dive right in.

## Responses

In your responses, you should separate the metadata from the the body and put them in their own objects.

```javascript
// Example: GET /api/user/2

{

    "meta": {
        "type": "success",
        "code": 200,
        "request_id": "someid"
        // etc ...
    },

    "body": {

        "id": 2,
        "name": "Aaqa",
        "location": "Delhi",
        "job": "Software Developer"
    }

}
```

When creating a new resource, always return a `201 created` instead of a `200 OK`. It's a common mistake developers make.
Another best practice is to return a url to the newly created resource in the location header of your response.
You can also choose to send a serialised version of the resource in the response body. (I personally like to do that).

```javascript

// Example: POST /api/users

// Response Headers

// Content-Type: application/json
// ...
// Location: https://yoursite.com/api/users/2

{
    "meta": {
        "type": "success",
        "code": 201,
        "request_id": "some_id"
    },

    "body": {

        "message": "User successfully added",
        "user": {

            "id": 3,
            "name": "Harry_Potter",
            "location": "London",
            "job": "Auror",
            "href": "https://yoursite.com/api/users/3"
        }
    }
}
```

### Errors

Properly dealing with errors is crucial to provide the best experience possible
to your users.  Just like with normal responses, always include the status code in the meta part.

You should also provide a nice descriptive message detailing the cause of the
error as well as a potential solution to fix it.

Doing this will help the consumers of your API to gracefully handle these errors on the client side. They will thank you for it.

```javascript
// Example GET /api/secretendpoint

{

    "meta": {
        "type": "error",
        "status": 401,
        "request_id": "weoifwe"
    },
    "body": {
       "message": "Unauthorized. Please login or create an account"
    }
}
```

## Status codes

This part is subject to many passionate debates, apparently it's a very touchy
topic.

Below I will list the most common status codes, what they mean and how I use
them.

* 200 - OK - Request went well, errthang's fine.
* 201 - Resource created - The resource was successfully saved to the database.
* 204 - No Content - There used to be a resource at this endpoint but not
  anymore (Used for `DELETE` requests)
* 400 - Bad request - The request was badly formatted. (ex: Invalid JSON)
* 401 - Unauthorized - Authentication failed due to invalid credentials.
* 403 - Forbidden - Authentication passed but the user does not have permission to access the resource
* 404 - Not Found - Well, [you know what it is](https://www.youtube.com/watch?v=yX2vWL2b2Rc)
* 405 - Method Not Allowed - The HTTP verb used to interact with the resource is not allowed. (eg: User tried to POST to a GET only endpoint)
* 409 - Conflict - The data passed in the payload conflicts with the resource in
  the server. (I return this status code in cases where a user creates/updates a
  resource with a unique field constraint attached to it such as a username or
  email)
* 422 - Unprocessable Entity - Again, another controversial one. I return a 422
  when the user sends an incomplete payload thereby violating the NOT NULL constraint attached to those fields.
* 429 - Too many requests - You made too many requests.
* 50x - Server Related Errors - Something went wrong server side.

### Caching

Caching is great and is a must when deploying an API. It helps a huge
amount with performace by reducing server load as you are not required to
perform the same action multiple times. You could choose to do it manually or use a reverse proxy like nginx or even something like varnish to handle that for you.

Caching will return a `304 Not Modified` if the resource hasn't changed. The great thing about this is that it does not affect your rate limiting, so there's
literally no excuse not to implement it.

### Rate Limiting

For security and performance reasons you want limit the amount of requests made
against your API.
You must return the maximum and remaining number of request allowed for a given user in a particular time window (which you are free to determine).

### CORS

You want to enable CORS to allow requests from browsers using AJAX. This can
be done by setting the following headers:

```bash
Access-Control-Allow-Origin: * # this means allow all domains to interact with the API
Access-Control-Allow-Headers: # All the headers you want to accept should be listed here
```

### A few tips

* Return urls to resources and total count when GETting collections
* Map your endpoints to collections and resources
* Always use plural nouns (Ex: /api/users not /api/user)
* Actions on resources must be described with HTTP verbs
* for partial updates of resources use PATCH instead of PUT
* for versioning, use dates instead of numbers in the URL (foursquare does exactly that)


---
If you have any comment, suggestions or remarks of any sort, you can ping
me on twitter [@aaqaishtyaq](http://www.twitter.com/aaqaishtyaq) !
