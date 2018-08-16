---
layout: post
title: Basic file operations in Python
---

In this short (spoiler: it's actually quite length) post, I will be going
through a list of very useful and handy methods in the `os` module
(which is part of the Python standard library) for handling files and
directories.

## 1. Create a directory

This one is pretty straightforward. If you're comfortable with the linux shell,
you know that `mkdir` is the command to use to create directories.
Unsurprisingly, Python uses the same naming convention.

Example:

```python
import os

os.mkdir("my_awesome_directory")
```

The method takes a string its argument and will create the directory under the
file's parent folder. (For instance, if the path to the file calling os.mkdir()
is /home/username/Documents/app.py, the "my\_awesome\_directory" will be created
under /home/username/Documents)

## 2. Get a file's parent directory.

This is useful if you want to get the path to a file/folder that you know is
under the working file's parent directory. If this was confusing, here's an
example.

In the Linux shell (bash or otherwise), you can issue the command `pwd`
(which I believe stands for "print working directory") to quickly print your
current location within a given session.

In Python you would achieve this like so:

```python
import os

CURRENT_DIR = os.getcwd()
```

Notice I used all caps for the variable name. This is because it's usually a
constant. This variable isn't meant to be changed.
You can now use this variable to locate any file or folder within that
directory. Keep reading and I'll show you how.

## 3. Concatenate paths

This is something you'll find yourself doing a lot. Especially on large projects
that require confiuration files and other such things. If you have experience
working with Django for example, they have a `settings.py` file littered with
calls to the os module. There are many benefits to this approach. Perhaps the
most obvious being is that if you ever decide to move your project to another
location, you don't want to keep modifiying the path every time. Remember,
programming is all about being lazy.

So this is how you would do it:

```python
import os

# Assuming this file is located at /home/username/myproject/app.py
# and that you want to operate on a a file called config.cfg within the same
# directory :

CURRENT_DIR = os.getcwd() # evaluates to /home/username/myproject
MY_TEXT_FILE = os.path.join(CURRENT_DIR, "config.cfg")

print(MY_TEXT_FILE) # /home/username/myproject/config.cfg
```
_An important note: os.path.join() merely concatenates the two paths together.
It doesn't check whether the path is valid. So be careful when using this
method. Also notice how the method call is to os.path.join() and not os.join()_


## 4. Check that a path exists

The other day I was working on a small web scraper for a side project of mine.
After the it was done fetching data, my script would save the results into a
pickle file (don't worry if you don't know what it is) that would be read by my
program, saving me the trouble of sitting there waiting to fetch the same info
over and over again each time I run the script.

The solution was to tell my script to check whether a specific file (let's call
it results.pkl) exists at a given path. It it does, the program continues and
if not, the program would execute the crawler function.

This is clever because now I only have to fetch the data and if the file gets
deleted I know I can rely on the program to go and crawl the sites as expected.

And now for the example:

```python
import os

CURRENT_DIR = os.getcwd()
RESULTS_FILE = os.path.join(CURRENT_DIR, "results.pkl")

def crawl_data():
    # scrapes a bunch of websites and saves the result in a file called
    # results.pkl under the current directory
    pass

if not os.path.exists(RESULTS_FILE):
    crawl_data()

else:
    ## the file exists so we can open it and work with its content
```

The same thing can be done to check that the path exists AND that it's a
directory:

```python
CURRENT_DIR = os.getcwd()
MY_DIRECTORY = os.path.join(CURRENT_DIR, "my_directory")

if os.path.exists(MY_DIRECTORY) and os.path.isdir(MY_DIRECTORY):
    ## do something with the files inside the folder
else:
    os.mkdir(MY_DIRECTORY)
```

## 5. List files within a given directory

Very useful when you want to read several files that are under the same
directory.
It can be done in two ways: conventional and pythonic. I'll show you both.

```python
for file in os.listdir("/path/to/dir"):
    # do something with the filename (open it, copy it,  move it, rename it...)

```
or

```python
filenames = [file for file in os.listdir("/path/to/dir")]
```

Guess which way is more pythonic !

## Conclusion

These have been the most useful file / directory functions for me in Python. I
really love the fact that the method names sound natural and are (for the most
part) similar to linux commands. What are your favourite file operation methods
? Any tip or trick you want to share with me ? Something I've missed ? Ping on
twitter ! I'm [@aaqaishtyaq](https://twitter.com/zabanaa).

If you found this article useful, please share it with your nerd friends /
coworkers and spread the word !
