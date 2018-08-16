---
layout: post
title: Don't be scared. Switch to vim.
---

I'm currently sitting at the most boring meetup I've probably ever attended in
Paris. It's about chatbots. I don't care about chatbots, I care about free
stickers and pizza. So I'll take this opportunity to open up about a subject
that's dear to my heart: vim.

I used to believe vim was exclusive to this superior race of developers who
gulp coffee like it's water and seem to only read HN and nothing else. (Hi, if
you're coming from HN). Architecure and Software design comes naturally to them,
they never run into bugs and they can recognise the most obscure of algorithms
at a glance (Shout out to Dan B, one of my ex coworkers).

Dan is a good, productive developer. Dan uses vim. I want to be like Dan. I want
to use vim.

There are a million reasons why you should jump ship and join the cult. In the
next paragraphs, I will detail some of these reasons.

## It's not (that) hard

There's definitely a learning curve to vim. But it's worth the
trouble. And if you're on Linux or MacOS, there's a built in tool called
`vimtutor` (just fire it up from a terminal, not sure about windows though) and
a wide variety of online tools to learn vim. Namely [openvim][0],
[vim adventures][1], and [vim genius][2].

Personally, The way I learned was by using it on small, fun side projects of
mine during the weekends, mostly to become familiar with the new mental model.
And just with like everything in life, shit takes time, and practice makes perfect.
So keep at it and you'll eventually come to your "aha" moment.
As you get more and more comfortable using vim, it will become harder and harder
to go back to a regular editor / IDE.

## It's Fast and Customisable

Because it runs on the terminal, you'll never have to wait 20 seconds to get
on with your work. (Atom anyone ?)

And if you like pretty things, there's a [large selection of colorschemes][11]
for you to choose from. On top of that, there's a plugin for just about anything
you might need. And if there isn't, you can program your own.


## Ubiquity

Not really, but I wanted to place a complicated word to sound smart.
Seriously though, it's everywhere. On Mac OS, Windows and of course Linux. If
you work on remote servers you can quickly edit files on the fly without having
to use nano. (Don't use nano)

Say for example a coworker / friend is running into a bug, you come to help and
they're using an IDE you're not familar with, well you can just access the files
from their terminal and start debugging right away.

Or if you're like me, and you spill water on your macbook keyboard and it becomes
toast, you can spin up a VPS on Digital Ocean or AWS, and pick up where you
left off (almost) right away.

## Bonus: Some of my favourite plugins

My colorscheme of choice (at the time of writing) is [ afterglow ][10].

And here's a list of my favourite plugins:


- [ Nerdtree ][3] (A tree explorer much like the sidebar in traditional IDEs)
- [ Airline ][4] (A sleek, customisable status bar)
- [ Surround ][5] (Helpful tool that helps with "surrounding" words with brackets etc)
- [ CtrlP ][6] (A fuzzy finder for vim)
- [ UtilSnips ][7] (Snippet utility for many languages)
- [ Vim  Markdown][8] (Markdown syntax highlighting)
- [ Goyo ][9] (Allows for distraction free editing)

I'll end this article with a quote from chamillionaire:
> They see you vimmin', they hatin'. Patroling they tryna catch me coding dirty

[0]: http://www.openvim.com/
[1]: https://vim-adventures.com/
[2]: http://www.vimgenius.com/
[3]: https://github.com/scrooloose/nerdtree
[4]: https://github.com/vim-airline/vim-airline
[5]: https://github.com/tpope/vim-surround
[6]: https://github.com/kien/ctrlp.vim
[7]: https://github.com/SirVer/ultisnips
[8]: https://github.com/plasticboy/vim-markdown
[9]: https://github.com/junegunn/goyo.vim
[10]: https://github.com/danilo-augusto/vim-afterglow
[11]: http://vimcolors.com/


