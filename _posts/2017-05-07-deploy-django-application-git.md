---
layout: post
title: Deploy your Django application with git
---

I'm going to make a bold statement: Django replaced Ruby on Rails in the hearts
of many developers. With this increase in popularity, we've seen tons or
articles, videos and websites dedicated to setting un Django and creating apps
using the framework.

Unfortunately, when it comes to deployment, many of these resources only mention
heroku or pythonanywhere. While these are excellent solutions for quickly
shipping your MVP or prototype, it lacks a bit in terms of flexibility if you
want to create your own custom deployment pipeline.

**tl-dr: If you manage your own server infrastructure, we're going to setup a git
deployment workflow with django**

## What you'll need

* Working knowledge of ssh
* Working knowledge of git
* Working knowledge of the bash shell
* Basic linux command line skills (sorry hipsters)
* (Very) Basic knowledge of vi/vim
* Patience

The typical workflow usually looks like this:

* You have your development environment, either on your local machine or a remote server
* A git server (on GitHub, BitBucket, GitLab ...) that you and your team push your work to
* A production server (aka your live app).

Usually when you commit and push work you do something like:

```bash
git push origin <branch_name>
```
`origin` being the name of the remote server your code is being pushed to.
What took me a while to realise is that you can have many remotes for your repo
that point to different servers.

The idea here is to add a new remote to our repo. It will point to our
production server such that when we run `git push live master`, our code will be
copied over to there.

## On the production server

To achieve this, we have some setup work to do on our live server. So go ahead
and connect to it via ssh.

```bash
ssh user@host_or_ip_address

# If your server's ssh service listens on a port other than 22, you'll need
# to add the -p switch

ssh -p PORT user@host_or_ip_address
```
Once we're in, we need to create a new directory for our application. This is
where our deployed code will be copied to.

```bash
mkdir -p /home/user/sites/myawesomedjangoproject

# Some people prefer to use /var/www/<project_name>, it's really up to you. Just
# make sure remember the path to your project
```

Now head over to `/var` and create another directory called `repos`

```bash
cd /var
sudo mkdir repos
# Depending on your setup, you might need sudo priveleges
```

Inside that directory, we need to create a folder named after our project
(or domain name) and append it with `.git` (not necessary but it's good practice)

```bash
sudo mkdir myawsomedjangoproject.com.git
```

Inside this folder we'll create what is called a `bare` repository. To do this
just run:

```bash
git init --bare
```

If you run `ls` inside that folder you'll see a bunch of files and directories
(the same ones found inside the `.git` folder in normal repos). One of these
directories is called `hooks`.

Inside that folder, we'll need create a file called post-receive.

```bash
# Assuming you are inside /var/repos/yourproject.git
sudo touch hooks/post-receive
```
Now open it up with vi/vim

```bash
sudo vim hooks/post-receive
```
Hit `i` to switch to insert mode, and add the following to the file:

```bash
#!/bin/bash
DEPLOYDIR=/home/username/sites/myawesomedjangoproject # or whatever path you chose
GIT_WORK_TREE="$DEPLOYDIR" git checkout -f
```
**Please note that the first shebang line is important, it instructs git to use
bash instead of the default shell. Otherwise it won't activate our (soon to be
created) virtual environment**

exit vim by hitting `:wq` (which in vim lingo means write and quit)

What we've done here is set two variables. `DEPLOYDIR` is an alias for our
project path on the server, and `GIT_WORK_TREE` which is a special variable that
tells git to copy the code it receives inside of our `DEPLOYDIR`. This ensures
that we're always running the latest version of our code.

As you've probably noticed, this post-receive file looks very much like a shell
script. That's because it is (as explained above). It's executed every time you
push code to the repo.

The last thing we need to is make the script executable, so as soon as you're
back in the shell run:

```bash
sudo chmod +x hooks/post-receive
```
You can now exit the server and go back to your local machine.

## On our local dev environment

Now that we've created our remote repository, we need to add it to our
project (I like to call mine `live`).

It takes one simple command:

```bash
git remote add live root@ip_address:/var/repos/myawesomedjangoproject.git

# And if your server's ssh service listens on a different port :

git remote add live ssh://root@ip_address:PORT/var/repos/myawesomedjangoproject.git

```
To make sure it was added, you can print the list of available remotes by running:

```bash
git remote -v # v for verbose

```
and that's it ! You can now make changes locally, commit and deploy
them live (or staging if it's a staging server) and see your changes instantly.

You can obviously still push to github/lab or bitbucket with
`git push origin <branch>`
like you normally would.

## Bonus

As I mentioned in the first part, the post-receive hook is a shell script. Which
means you can use it to perform all kinds of tasks against your code, like
running front-end builds, installing dependencies, etc ...

Here's an example for a basic Django App:

```bash
#!/bin/bash

DEPLOYDIR=/home/username/site/myawesomedjangoproject

echo "[log] - Starting code update "
GIT_WORK_TREE="$DEPLOYDIR" git checkout -f
echo "[log] - Finished code update "

if [[ -d "$DEPLOYDIR/ENV_projectname"]]; then
    echo "[log] - Cleaning virtualenv"
    cd "$DEPLOYDIR"; rm -rf ENV_projectname cd -
    echo "[log] - Finished creating virtualenv"
fi

echo "[log] - Creating virtualenv"
cd "$DEPLOYDIR"; virtualenv -p python3 ENV_projectname; cd -
echo "[log] - Finished creating virtualenv"

echo "[log] - Activating virtualEnv"
cd "$DEPLOYDIR"; source ENV_projectname/bin/activate; cd -
echo "[log] - Finished activating virtualenv"

echo "[log] - Pulling down pip dependencies"
cd "$DEPLOYDIR"; pip install -r requirements.txt; cd -
echo "[log] - Finished pulling down pip dependencies"

echo "[log] - Staring DB migration"
cd "$DEPLOYDIR"; python manage.py makemigrations; python manage.py migrate; cd -
echo "[log] - Finished DB migration "

echo "[log] - Pulling Node Dependencies"
cd "$DEPLOYDIR"; sudo npm install; cd -
echo "[log] - Finished Pulling Node Dependencies"

echo "[log] - Building the Front end"
cd "$DEPLOYDIR"; sudo gulp build; cd -
echo "[log] - Finished building the Front end"

echo "[log] - Collecting static assets"
cd "$DEPLOYDIR"; python manage.py collectstatic --clear --no-input; cd -
echo "[log] - Finished collecting static assets"

echo "[log] - Restarting App"
sudo service myawesomedjangoapp restart;
echo "[log] - Finished collecting static assets"

```
_I run my Django Apps as systemd services, if you don't you can just call python
manage.py runserver. If you want to know how to setup Django the way I do just
follow this very comprehensive tutorial over on [Digital Ocean][1]_

## Conclusion

I am fully aware that there are more sophisticated methods of deployment through
Docker, Travis (For continious integration) etc. But if you have a small app that
you want to ship and you already have an infrastructure, I've found this method
to be more than suitable.

Please report any missing info, mistake, error, typo. I'm on [ twitter ][0] if you
wanna chat.

[0]: https://twitter.com/aaqaishtyaq
[1]: https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-14-04
