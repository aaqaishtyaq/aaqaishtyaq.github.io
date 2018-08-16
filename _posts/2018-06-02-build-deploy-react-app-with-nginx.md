---
layout: post
title: Deploy a React app with sass using Nginx
---

A couple of days ago (at the time of writing), I started my newest side
project. It's a portfolio showcasing my (very very very) amateur
photography. It's written in React.js with Sass and I have to say it was
extremely enjoyable to work on. Unsurprisingly though, I ran into some issues while
deploying to production, which after a lot of head banging against every
possible flat surface I could find, I managed to sort. So this post will be about
how to make React.js work with sass in production and how to serve the project
using Nginx as a front end web server.

We'll be using the official starter kit / CLI tool provided by the facebook
team called `create-react-app`.

You can install it by running the following command:

```bash
npm install -g create-react-app
```

## Adding Sass to a React project

Including sass in a React app can be done in two ways: You can either eject the
project and manually modify the webpack config files or you can follow the
procedure in the [official docs][1]. I've personally chosen to go with the first approach.
You can just follow the steps in this [tutorial][2] to get up and running.

_Note: If you went with the second approach, you can just skip the following and
directly jump to the next section_

Once you've done that, open the config/webpack.config.prod.js file, locate the
`rules` section under `module.exports` and add the following snippet to it.

```javascript
{
    test: /\.sass$/,
    use: ExtractTextPlugin.extract({
        fallback: require.resolve("style-loader"),
        use: [require.resolve("css-loader"), require.resolve("sass-loader")]
    }),
    include: paths.appSrc,
}
```
This config will be executed when you call `npm run build`. If you don't do
this, you'll end up with an empty css file.

## Important note

Before building the project for the first time, we must first unregister the
service worker. Doing this will ensure that the static assets aren't cached by
the client's browsers. It's important because if you skip this step, any
subsequent change / build you'll deploy won't necessarily be reflected right away
client side. (I'm not knowledgable enough on service workers to provide details
on this behaviour, but it's something to note. If you really need service
workers in your project, you might want to explore other solutions to avoid
asset caching).

Your index.js file should now look something like this:

```javascript
import { unregister } from './registerServiceWorker'
import App from './App';
ReactDOM.render(<App />, document.getElementById('root'));
unregister()
```

## Building the project

This is the part where we actually build our project. By building I mean
compiling all React files and their related dependencies, transpiling them into
vanilla Javascript, compiling sass files into css, minifying them etc ...
To do this, we can simply run `npm run build` and voila ! You should have a
brand new `build` folder in your project.

## Creating our deploy script

Your app is now compiled and ready to be served. Now is a good time to start
thinking about deployment strategies. In this basic scenario
(and quite frankly, most scenraios), you really just want to upload the build
folder to a remote server and have it accessible as a static site.

You can use ftp to transfer the files and it would be perfectly acceptable, but
it's not the most flexible solution. The alternative is to use a CLI utility called
`rsync` (which is available on mac and linux, not sure about windows). With
rsync, you can synchronise files and folders within the same computer or across
machines you have ssh access to.

Here's the command we would run to synchronise the build folder to a server
on the internet:

```bash
# Asssuming we're inside the project folder
rsync -avP build/ username@remote_ip:/destination/path
```

Let's break down this command:

`-a` means archive, which is a shortcut for multiple switches. It
recursively syncs all files and subfolders within `build` to the
destnation path, keeping the modification dates, permissions and other metadata
unchanged.

`-v` means verbose. It just outputs the steps to the screen so you can see
what happens in real time.

`-P` stands for progress. This is particularly useful in this case because you
rely on a network connection to sync the files. Using this option will
display a progress bar for each file in the queue.

But you don't want to keep doing all of that every time we want to push now do
you ?

Thankfully, you can use create a bash script to automate this process a litte
bit. Here's how mine looks like:

```bash
#!/bin/sh

echo "[log] - Merging branch to master"
git checkout master && git merge develop && git push origin master
echo "[log] - Merge completed"

echo "[log] - Compiling project to build folder ..."
npm run build
echo "[log] - Build process done"

echo "[log] - Deploying files to server"
rsync -avP build/ user@host:/destination/path
echo "[log] - Deployment completed"

echo "[log] - Switching to develop"
git checkout develop
echo "[log] - Done!"
```

Again, let's walk through that script section by section:

1. I checkout to master, merge develop and push. This ensures that my master
   branch is always up to date with the latest version of my working codebase.
2. I execute `npm run build` which, as previously explained, will create the
   build directory with our compiled, ready to be deployed files.
3. I use rsync to copy over the contents of the build folder to the destination
   path in the remote machine I administer. (notice the trailing slash after
   build/, this tells rsync to copy the contents of the folder and not the
   folder itself).
4. I switch the current working branch back to develop so that I can start
   developing without accidentally altering the state of `master`.

Obviously this is very basic and in a more complex project, you'd have to run
unit tests and do other things your project requires.

Finally, you need to give executable permissions to the file by running:

```bash
sudo chmod +x deploy.sh
```

Now all you have to do when you want to deploy your project to production is run

```bash
./deploy.sh
```

## Serving our site with Nginx

*Note: this assumes your server is running ubuntu or any other debian based
distro*

Ok, so if you've followed the steps correctly, you should have your project
files uploaded to your remote server. Now we need to use Nginx to make the site
accessible to the internet.

First, create a new config file inside `/etc/nginx/sites-available`.

```bash
cd /etc/nginx/sites-available
touch mywebsiteconfig # File extension is not required in this case
```
Next step is to edit the file using either vim or nano (sudo privileges may be
required).

```nginx
server {

    listen 80;
    server_name mywebsite.com www.mywebsite.com;

    location / {
        root /path/to/your/project;
        index index.html index.htm;

        default_type "text/html";
    }

    access_log /var/log/nginx/mywebsite_access.log;
    error_log /var/log/nginx/mywebsite_errors.log;
}
```

If you're not familiar with Nginx, let me explain what you just copied.

1. We created a server block to hold our configuration and keep it separate from
other configs we may add in the future (like https for example).
2. We declare the listen directive which tells nginx to listen on port 80.
3. We set the server\_name to our domain name. This tells nginx to apply the
config settings to any incoming request from any of listed urls.
4. Finally, we specify the paths to both the access and error logs. It's
   optional but highly recommended, so that you know exactly where to look when
   errors happen. This will save you a tonne of time when troubleshooting issues
   in the future.

Close the file and exit nano or vim.

Nginx keeps its configuration files in two separate directories:
`/etc/nginx/sites-available` and `/etc/nginx/sites-enabled`. It will serve
any website whose configuration file is in the latter folder.

All you have to do now is create a symlink (think of it like a shortcut to an app
in a desktop GUI) to your config, and store it in `sites-enabled`.
That way, if you ever decide to shut down the site, you'll simply need to
delete the symlink and you're good.

Before creating the symlink, it's good measure to check if the configuration
file has any errors in it. To check for errors just run the following command:

```bash
sudo nginx -t
```

It will scan all of your config files and check for errors (and return them to
you if there are any).

Now you can create the symlink by executing:

```bash
sudo ln -s /etc/nginx/sites-available/mywebsite /etc/nginx/sites-enabled
```

_Note: If you decide to use service workers with your project and you're still
running into caching issues, you should know that Nginx can also be used as a
static assets server. I haven't looked into this scenario yet. I might test that
approach in the future and detail the process in another post._

Lastly, reload nginx and your website should now be accessible via its URL
(provided you correctly setup the DNS settings with your domain name registrar)

```bash
sudo service nginx reload
```

If you read this article all the way through, thanks for sticking with me ! You
can send me questions, remarks, or comments on twitter, I'm [@aaqaishtyaq][3] on
twitter.

[0]: http://example.com
[1]: https://github.com/facebookincubator/create-react-app/#getting-started
[2]: https://medium.com/@Connorelsea/using-sass-with-create-react-app-7125d6913760
[3]: https://twitter.com/aaqaishtyaq
