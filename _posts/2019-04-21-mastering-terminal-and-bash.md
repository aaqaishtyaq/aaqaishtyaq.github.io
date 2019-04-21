---
layout: post
title: "Mastering Terminal & Bash"
---

## Theory

If there is one tool that every developer uses regardless of language, platform, or framework it’s the terminal. If we are not compiling code, executing git commands, or scp-ing ssl certificates to some remote server, we are finding a new version of cowsay to entertain ourselves while we wait on one of the former. As much as we use the terminal it is important that we are efficient with it. Here are some ways I make my time in the terminal efficient and effective.

## Assumed Settings

Some of these commands list `alt` as a prefix character. This is because I have manually set `alt` as a meta key. Without this setting enabled you have to use the `esc` key instead. I recommend enabling the alt key. In Mac Terminal.app this setting is Preferences > Profiles tab > Keyboard sub-tab > at the bottom “Use option as meta key.” In iTerm2 the setting is at Preferences > Profiles tab > Keys sub-tab > at the bottom of the window set “left/right option key acts as” to “+Esc”. In GNOME terminal Edit > Keyboard Shortcuts > uncheck “Enable menu access keys.”

I also assume you’re using bash. I know there are some cool newcomers out there like zsh and fish, but after trying others out I always found that some of my utilities were missing or ill-replaced. If you are not using bash then YMMV.

I also assume you are using at least bash version 4. If you’re on a Mac then, unless you have manually installed bash with homebrew, you are using an old version. Install bash with homebrew and include it in `/etc/shells`.

## Repeat Commands

I spend a lot of my time in terminal repeating commands that I have previously run. One thing I noticed a lot of people do is use the up and down arrows to navigate their history of commands. This is terribly inefficient. It requires repositioning your hands and often times removing your eyes from the computer screen. Also, your history (depending on your HISTSIZE) can be very long. Using the up and down arrows is almost like searching through a terrible version of the Oxford English Dictionary which has one word per page. Instead of searching line-by-line I use search history (`ctrl-r` and `ctrl-s`).

In your terminal window, before you type any text press `ctrl-r` and you should see your prompt change to `(reverse-i-search):`. Now begin typing any part of any previous command you have executed and you will see the most recent command which matches your search. If this is not the one you want, press `ctrl-r` again to search incrementally. For example, if you are searching for `kubectl delete pods -l=app=nginx` you would type `kubectl` or `kubectl del`. You should land on that command. If, while incrementally searching backward, you pass the one you’re looking for, press `ctrl-s` to go the other direction and you will see your prompt change to `(i-search):`. Once you find the command you want press enter to execute it or move the cursor left/right to modify the command first.

_NOTE `ctrl-s` probably won’t work by default for most terminals. You will need to add `stty -ixon` to your `~/.bashrc` (`~/.bash_profile` for Mac)_.

Sometimes you know that the command that you want to repeat is only two or three places back in history. In these cases it is sometimes easier to move up to that command directly. But you still should not use the arrow keys. Bash has keyboard shortcuts for this too! Here is where we use `ctrl-p` for “previous” or `ctrl-n` for “next.” Pressing `ctrl-p` moves to the previous command in history (replacing the up arrow), and `ctrl-n` moves to the next command (replacing the down arrow).

In mose cases your history will probably be set to record duplicates. This gets pretty annoying for me so I use the following setting to make sure my history doesn’t get flooded with duplicate entries. Add this to your `~/.bashrc` or `~/.bashprofile` and your history will only keep the newest versions of commands. If you typed `git status` seven times, it will only record the latest one and delete the previous entries.

```bash
export HISTCONTROL=ignoreboth:erasedups
```

## Movements

Now that we know we don’t need the up and down arrow keys, what about the left and right? Unfortunately, these keys are still needed for single character movements, but I find myself using them less often. Here are some key combinations to move your cursor a little more efficiently.

1. `ctrl-a` - move the cursor to the beginning of the current line
2. `ctrl-e` - move the cursor to the end of the current line
3. `alt-b` - move the cursor backwards one word
4. `alt-f` - move the cursor forward one word
5. `ctrl-k` - delete from cursor to the end of the line
6. `ctrl-u` - delete from cursor to the beginning of the line
7. `alt-d` - delete the word in front of the cursor
8. `ctrl-w` - delete the word behind of the cursor

The last four aren’t necessarily movements, but I use them in conjunction most of the time.

## Copy / Paste

One of my favorite MacOS command line utilities is `pbcopy`/`pbpaste`. I like them so much that I created the aliases for my linux machines using `xclip` (shared below). These two commands use your system clipboard (also called the pasteboard, hence the names). You can pipe data to `pbcopy` to copy something to your system clipboard or you can pipe `pbpaste` to another command to paste from your clipboard. Here are some examples that I use:

```bash
# copy my public ssh key to system clipboard for pasting into Github
pbcopy < ~/.ssh/id_rsa.pub

# paste something I've copied from the internet to a file
pbpaste > main.go

# append something I've copied from the internet to the END a file
pbpaste >> main.go

# copy my public IP address to clipboard
curl -Ss icanhazip.com | pbcopy

# copy my private IP address to clipboard
# it's probably a good idea to alias this
ip addr show en0 | grep -inet\ | awk '{ print $3 }' | awk -F/ '{print $1}' | pbcopy

# replace what is in my clipboard with the base64 encoded version of itself
pbpaste | base64 | pbcopy
```

In linux, I put the following in my ~/.bashrc to create the same effect.

```bash
alias pbcopy='xclip -selection clipboard'
alias pbpaste='xclip -selection clipboard -o'
```

## Changing Directories

`cd` is one of my most used commands according to my bash history. One thing I find myself doing a lot is changing between two directories or briefly changing from directory a to directory b and then back to a. Depending on the reason I’m changing directories I will use either `cd -` or a combination of `pushd` and `popd`. If you type `cd -` and press enter, you will change to your previous working directory.

```bash
cd ~/go/
cd ~/tmp/
cd - # <- this puts you back to ~/go/
cd - # <- this puts you back to ~/tmp/
```

On the other hand, sometimes I know that I want to go to some directory in a different place, but I might `cd` a few times to get there, but I want to mark my place so that I can get back quicker. In this case, you would use `pushd` like this.

```bash
cd ~/go/
pushd ~/tmp/ # mark your current directory and cd to ~/tmp/
cd ssl
cd certificates
# cd - <- this would take you back to ~/tmp/ssl because it is the previous working directory
popd # <- this takes you back to ~/go/
```

You can `pushd` multiple times to build a stack. I don’t find myself doing this much, but it’s there if you need it.

## Background Processes

One of my pet peves about working with other software developers is that they almost always have ten or more terminal windows open at all times. Usually, they will have one terminal per directory they are working with (this can be avoided by using `pushd`, `popd`, and `cd` tricks mentioned above). But often they will have a few windows open that are running processes which have locked the window. This is difficult to work with because it requires flipping back and forth and knowing where everything is. For executing processes I like to use a mixture of some commands.

If you need to run a command indefinitely you can send it to the background by first running it and then pressing `ctrl-z`. This will _suspend_ or _pause_ the process. After it has been suspended, type `bg` and press enter. This will move it to a running state, but it will no longer have control of your terminal window. However, if you close the terminal that job will terminate. To avoid this, you _disown_ the process by typing `disown` and pressing enter. At this point the process is no longer a child of your current terminal process. I often use this to run `kubectl proxy` or `python -m SimpleHTTPServer`.

1. `ctrl-z` - move the current process to the background in a _suspended_ state.
2. `jobs -l` - list the current background processes for the current tty session.
3. `bg` - tell the most recent background process to continue running in the background
4. `fg` - bring the most recent background process back to the foreground
5. `disown -h` - disown the most recent background job. This will remove it from your current tty session. It will not be able to be  brought back to the foreground. You will have to control it either with `kill` or something else.

`bg`, `fg`, and `disown` can be used with the job number found in `jobs -l`. If you run `jobs -l` you will see the job number at the beginning of the line. If you want to bring the 2nd job to the foreground you run `fg %2`. If you want to disown the fourth job then you run `disown -h %4`, and so on. The plus sign (or minus sign) at the bigging of the line has meaning as well. A plus sign indicates that the job is the most recently used, or the one that will be targeted if you type any of the commands without a job ID. The minus sign is the second most recently used.

```bash
aaqaishtyaq@Aaqas-MacBook-Pro:~/tmp
$ kubectl proxy
Starting to serve on 127.0.0.1:8001^z
[1]+ Stopped             kubectl proxy
aaqaishtyaq@Aaqas-MacBook-Pro:~/tmp 1
$ bg
[1]+ kubectl proxy &
aaqaishtyaq@Aaqas-MacBook-Pro:~/tmp 1
$ jobs -l
[1]+ 48393 Running       kubectl proxy &
aaqaishtyaq@Aaqas-MacBook-Pro:~/tmp 1
$ disown
aaqaishtyaq@Aaqas-MacBook-Pro:~/tmp
$ jobs -l
aaqaishtyaq@Aaqas-MacBook-Pro:~/tmp
$
```

I use `ctrl-z` a lot because I use a single terminal window for vim and as my command line interface. When I’m writing code in vim and I need to get back to my shell prompt I use `ctrl-z` to suspend vim.
_NOTE this will still print stdout and stderr to your command window. If you want to change that then you can redirect to files_.

I modified my `PS1` to show my current background job count

```bash
function jobs_count {
    cnt=$(jobs -l | wc -l)
    if [ $cnt -gt 0 ]; then
        echo -ne " \e[93m${cnt}\e[m"
    fi
}
# then you can add \`jobs_count\` to the end of your PS1 like this
export PS1="\[\e[32m\]\u\[\e[m\]@\[\e[32m\]\h\[\e[m\]:\[\e[34m\]\w\[\e[m\]\`git_branch\`\`jobs_count\`\n\$ "
```

```bash
aaqaishtyaq@Aaqas-MacBook-Pro:~/tmp 1 #<--- here
$
```

## Working With Files

Several times throughout the day I want to view the contents of a file. Before, I would `cat` the file or open it in `vim`. `cat` was annoying because it flooded my terminal history. This is when I learned to use `less` to open files with pagination. When you open a file with `less` the contents of the file become paginated and you start at page one. What’s great about `less` is that many of my favorite key combinations work. You can use `ctrl-u` to page up, `ctrl-d` to page down, `ctrl-p` to scroll up one line, `ctrl-n` to scroll down one line, `g` goes to the top of the file, `G` goes to the bottom of the file, and `/` searches the file.

While `less` is great for opening files, I may not know where the file is in the first place. Say I have a file named “auth.py” but I don’t remember exactly where I put it. I could `cd` back and forth until I find it, or do what some people do and run `start .` and browse for it in a UI window (terrible workflow). Instead, I use either `find`, `ag` (silver searcher), or `tree`. `find` is great for searching by file name. You can run `find . -type f -name auth.py` to search the current directory for a file named “auth.py”. `tree` is great for listing a directory in a tree format (much like how you see it in a UI). `ag` is an applciation called “the silver searcher.” It is essentially a modernized version of `grep` and I find myself using it quite often. It’s better than `grep` in that it automatically ignores commonly ignored files such as the .git directory, virtualenv, and anything listed in your .gitignore. I like silver searcher because the command line arguments are very similar to `grep` so my flags are generally transferrable.
_Note It’s best to combine these commands with less because they will likely flood your terminal history_.

## Choose a Few to Start With

I did not use all of these when I first started using bash, nor did I memorize them all at once. I picked up one or two here and there over the years. It’s difficult to memorize key combinations, especially when there are so many of them. Pick one or two shortcuts and focus on using them. I find myself using these commands by muscle memory, not by memorizing each keyboard shortcut. In fact, once I started to write this I had to open up the terminal and work around to remember which shortcuts I use. I hope these help you work with bash and terminal more effectively. It is easy to learn one new trick and force yourself to use it for a few days until you get used to it. Once you are comfortable with that command, pick up another one.

---
So there you go, I hope you learned something useful in this article. If you know
other mind-blowing tips and tricks for bash and terminal, [@ me on twitter](https://twitter.com/aaqaishtyaq).