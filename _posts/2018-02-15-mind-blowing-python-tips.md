---
layout: post
title: Mind-blowing Python tips
---

## 0 - Loop over a range of numbers
Use `range` instead of `xrange`.
In python3, the former  creates an iterator which produces the values one at
a time making it much more efficient and fast.

```python

nums = [0,2, 34, 55, 32]
for i in range(nums):
    print i

```

## 1 - Looping backwards
.reversed use Just

```python

names = ["Case", "Molly", "Armitage", "Maelcum"]
for name in reversed(names):
    print name

```

## 2 - Looping over a list and its indices

To keep track of the index of each item in a collection, enumerate is your buddy.

```python
names = ["Case", "Molly", "Armitage", "Maelcum"]
for index, name in enumerate(names):
    print index, name

```

## 3 - Looping over two lists simultaneously
Yeah you could use zip, but izip is faster, so use that instead.

```python

from itertools import izip

names = ["Case", "Molly", "Armitage", "Maelcum"]
ages = [23, 27, 41, 24]
for name, age in izip(names, ages):
    print name, age

```

## 4 - Looping over a sorted list

You can sort out the list first then loop through it, or you could use
sorted.

```python

names = ["Case", "Molly", "Armitage", "Maelcum"]
for name in sorted(names):
    print name

```
And BAM, you're ... sorted.

## 5 - Call a function until a sentinel value is returned

To do that, use iter().

Bad example:

Loop over a file containing a list of names
until the loop returns an empty string,
in which case we break out of it.

```python

names = []
while True:
    name = file.read(32)
    if name = "":
        break
    names.append(name)
```

Beautiful example:

In this case, we call a function (f.read) until it returns the sentinel value
passed as a second argument to iter.
That way we avoid having to make the unnecessary if check.

```python
for name in iter( partial(f.read(32)), ""):
    print name
```

## 6 - Looping over a dictionary

The normal way to do it:

```python
molly = { "name": "Molly Millions", "Age": 27, "Occupation": "Professional Killer"}

for key in molly:
    print key
```
If you wish to mutate the data, prefer `dict.keys()`.

```python

molly = { "name": "Molly Millions", "Age": 27, "Occupation": "Professional Killer"}

for key in molly.keys():
    # do the mutation

```

## 7 - Looping over a dict keys AND values

Don't do this:


```python

molly = { "name": "Molly Millions", "Age": 27, "Occupation": "Professional Killer"}

for key in molly:
    print molly[key]

```

It's slow because we have to rehash the dictionary and do a lookup everytime.

Instead choose `iteritems()`:

```python

molly = { "name": "Molly Millions", "Age": 27, "Occupation": "Professional Killer"}

for key, value in molly.iteritems():
    print key, value

```

## 8 - Create a dict out of two lists

Just instantiate a new dict with two zipped lists. Real magic.

```python

from itertools import izip

names = ["Case", "Molly", "Armitage", "Maelcum"]
ages = [23, 27, 41, 24]

characters = dict(izip(names, ages))

```

## 9 - Use named tuples for returning multiple values

Like in the case of an API response in Flask.

```python

from collections import namedtuple

Response = namedtuple('APIResponse', ['status_code', 'body', 'headers'])

@app.route('/users/1'):

    try:
        user = db.getuserbyid(1)
    except:
        return Response(404, user.notfound(), {'content-type': 'application/json'}
    else:
        return Response(200, user.json(), {'content-type': 'application/json'}

```

## Other

* Always clarify function calls by using keyword arguments

If you learned something from this article, share it with your co-workers and
fellow hackers. If you notice any typo, error etc let me know on
[twitter](https://twitter.com/aaqaishtyaq).
