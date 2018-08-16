---
layout: post
title: How to use Flask to upload files to Amazon s3
---

In this article, we'll be covering how to upload files to an Amazon S3 bucket
using the Flask web framework for python.

## Step 1: Connect to Amazon 3

Before we can start uploading our files, we need a way to connect to s3 and
fetch the correct bucket.
Log in to your AWS management console and under your name (on the top right,
select "My security credentials" then open the "Access Keys (Access Key ID and
Access Key Secret)" tab and finally click "Create New Access Key".

_Take note of those as you'll need both to connect to the service later on_

Now that we have our credentials, we need to install the necessary packages for
our project.

```bash
pip install flask boto3
```
boto3 is the newest version of the AWS SDK, it provides a high level interface
to interact with their API.

## Step 2: Create a Basic Flask App

```python
# flask_s3_uploads/__init__.py

from flask import Flask, render_template

app     = Flask(__name__)
app.config.from_object("config")

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run()
```

```python
# flask_s3_uploads/config.py

import os

S3_BUCKET                 = os.environ.get("S3_BUCKET_NAME")
S3_KEY                    = os.environ.get("S3_ACCESS_KEY")
S3_SECRET                 = os.environ.get("S3_SECRET_ACCESS_KEY")
S3_LOCATION               = 'http://{}.s3.amazonaws.com/'.format(S3_BUCKET)

SECRET_KEY                = os.urandom(32)
DEBUG                     = True
PORT                      = 5000
```
This is the step where you need to store your AWS credentials (preferably in
environment variables).

```bash
export S3_BUCKET="your bucket name"
export S3_KEY="your aws access key"
export S3_SECRET_ACCESS_KEY="your aws secret access key"
```

This is what our upload form looks like:
```html
<!-- templates/index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>

    <h1>Upload Your Files Bro</h1>

    <form action="/" method="POST" enctype="multipart/form-data">

        <label for="user_file">Upload Your File</label>
        <br></br>
        <input type="file" name="user_file">
        <br></br>
        <button type="submit">Upload</button>

    </form>

</body>

</html>
```
We've now created a barebones flask application with a single GET route that
renders our upload form. We've also set the basic config settings for the app.

## Step 3: Connect to AWS

In your project, create a `helpers.py` file. We'll use boto3 to establish a
connection to the S3 service.

```python
import boto3, botocore
from config import S3_KEY, S3_SECRET, S3_BUCKET

s3 = boto3.client(
   "s3",
   aws_access_key_id=S3_KEY,
   aws_secret_access_key=S3_SECRET
)
```

## Step 4: Upload a file to S3

Now that we are successfully connected to S3, we need to create a function that
will send the user's files directly into our bucket.
We'll use boto3's `Client.upload_fileobj` method for this. Our function will
accept three arguments: a `file object`, a `bucket name` and an optional acl
keyword argument (set to "public-read" by default).

```python

def upload_file_to_s3(file, bucket_name, acl="public-read"):

    try:

        s3.upload_fileobj(
            file,
            bucket_name,
            file.filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )

    except Exception as e:
        # This is a catch all exception, edit this part to fit your needs.
        print("Something Happened: ", e)
        return e

```

As you can see, we're calling the `upload_fileobj` method passing a file and a
bucket name. We also set a default `acl` keyword argument to `public-read`.

Notice that, in addition to `ACL` we set the `ContentType` key in `ExtraArgs` to
the file's content type. This is because by default, all files uploaded to an S3
bucket have their content type set to `binary/octet-stream`, forcing the browser to
prompt users to download the files instead of just reading them when accessed via
a public URL (which can become quite annoying and frustrating for images and
pdfs for example).

## Step 5: Return a URL to the uploaded file

Files hosted on an S3 bucket can be accessed via a public URL that usually looks
something like `https://bucketname.s3.amazonaws.com/filename.extension` (or if
you have folders in your bucket:
`https://bucketname.s3.amazonaws.com/folder/filename.extension`).

Thankfully, we have saved the first part of the URL in our config file. All we
have to do is append the file's name to it, return it and voila !

```python

def upload_file_to_s3(file, bucket_name, acl="public-read"):

    ## upload logic here
    ## ...
    ## ...
    ## ...

    return "{}{}".format(app.config["S3_LOCATION"], file.filename)
```

This is what the final function looks like:

```python
def upload_file_to_s3(file, bucket_name, acl="public-read"):

    """
    Docs: http://boto3.readthedocs.io/en/latest/guide/s3.html
    """

    try:

        s3.upload_fileobj(
            file,
            bucket_name,
            file.filename,
            ExtraArgs={
                "ACL": acl
                "ContentType": file.content_type
            }
        )

    except Exception as e:
        print("Something Happened: ", e)
        return e

    return "{}{}".format(app.config["S3_LOCATION"], file.filename)

```

## Step 6: Upload files to our bucket

Now that we have a function to upload a file to S3, we need a piece of logic to
send the file from the user's computer directly to the bucket.
First we need to set up a new POST route for that (I like to keep my routes
separate even if they share the same endpoint. I think it's more clear and
modular that way but feel free to do it however you want)

```python
# flask_s3_uploads/__init__.py

from flask import Flask, render_template, request, redirect
from werkzeug.security import secure_filename

app = Flask(__name__)
app.config.from_object("flask_s3_upload.config")

from .helpers import *

@app.route("/", methods=["POST"])
def upload_file():

	# A
    if "user_file" not in request.files:
        return "No user_file key in request.files"

	# B
    file    = request.files["user_file"]

    """
        These attributes are also available

        file.filename               # The actual name of the file
        file.content_type
        file.content_length
        file.mimetype

    """

	# C.
    if file.filename == "":
        return "Please select a file"

	# D.
    if file and allowed_file(file.filename):
        file.filename = secure_filename(file.filename)
        output   	  = upload_file_to_s3(file, app.config["S3_BUCKET"])
        return str(output)

    else:
        return redirect("/")
```

A. We check the request.files object for a `user_file` key. (`user_file` is the
name of the file input on our form). If it's not there, we return an error message.

B. If the key is in the object, we save it in a variable called `file`.

C. We check the filename attribute on the object and if it's empty, it means the
user sumbmitted an empty form, so we return an error message.

D. Finally we check that there is a file **and** that it has an allowed
filetype (this is what the `allowed_file` function does, you can [check it out in
the flask docs][0]).

If both tests pass, we sanitize the filename using the
`secure_filename` helper function provided by the `werkzeurg.security` module.
Next, we upload the file to our s3 bucket using our own helper function, we store
the return value (ie the generated presigned url for the file) in a variable o
called `output`. We end by returning the generated url to the user.

_Note: if one of the tests fail, we just redirect the user to the home page,
similar to a refresh_

## Other nuggets

### Get all buckets attached to your account

```python
buckets         = s3.list_buckets()
```

### List all objects (files) in a bucket

```python
# Both are valid
objects         = s3.list_objects(Bucket=S3_BUCKET)
objects         = s3.list_objects_v2(Bucket=S3_BUCKET)
```

### Access the files in a bucket

```python
all_files       = objects["Contents"]
```

### Get the total number of files in a bucket

```python
# If you used client.list_objects_v2
number_of_files = objects["KeyCount"]

# Else
number_of_files = len(all_files)
```

### Extract all file names

```python
file_names      = [file["Key"] for file in objects["Contents"]]
```

## Conclusion

There you have it people ! This is pretty much how you can upload files
directly to Amazon S3 using Flask. S3 in an amazing service, you should totally
take advantage of it. Plus it has a free tier so why not give it a try, you
won't be disappointed.
If you spot any typo, mistakes or know a better way to achieve the same thing,
please give me a shout on [twitter](https://twitter.com/aaqaishtyaq).
Stay cyber, stay punk and happy hacking.

[0]: http://localhost:3000/notes/upload-files-amazon-s3-flask.html
