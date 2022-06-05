---
layout: post
title: "Open markdown links in a new tab"
---

I created a static website [linkbin](https://linkbin.aaqa.dev/), Where I could save links in a markdown file that can be viewed later.
It is serving its purpose and because it uses [hugo](https://gohugo.io/), I don't have to think about VPS cost.

Recently, I ran into an issue where my website serves links but when you click on it, It will open the link in the same tab. Ugggh! I don't want to close my website just to open a link. Ideally, it should open the link in a new tab.

How can we do it? It would be easy Eh?

## The generic way

Since markdown is eventually rendered as HTML, The most naive way I found was to write HTML in markdown

```html
<a href="http://example.com/" target="_blank">example</a>
```

No way, I am going to rewrite all my links into HTML. It adds cost later on as well. I will have to add HTML tags to write the link instead of this syntax:

```markdown
[link](example.com)
```

## The specialized way

This could vary depending upon the markdown parser you are using.
If you're using Jekyll, like this website, then you can use the following syntax to open links in a new tab.

```markdown
[link](url){:target="_blank"}
```

But, I am not using Jekyll for [linkbin](https://linkbin.aaqa.dev). It uses a fairly newer version of [Hugo](httpsP://gohugo.io). Hugo ,`v0.62.0 or later`, uses [Goldmark](https://github.com/yuin/goldmark) parser and supports [Markdown render hooks](https://gohugo.io/templates/render-hooks/). Markdown Render Hooks offer you several ways to extend the default markdown behavior, e.g. resizing uploaded images, opening links in new tabs, or creating mermaid diagrams from code. You can do this by creating templates in the `layouts/_default/_markup` directory with base names `render-link` or `render-image` or `render-codeblock`. Your directory layout may look like this:

``` console
layouts
└── _default
    └── _markup
        ├── render-image.html
        ├── render-image.rss.xml
        ├── render-link.html
        ├── render-codeblock.html
        └── render-codeblock-bash.html
```

### Render hook to open link in a new tab

Add the following HTML template file (or render hook) at `layouts/_default/_markup/render-link.html`:

```html

<a href="{{ .Destination | safeURL }}"{{ with .Title}} title="{{ . }}"{{ end }}{{ if strings.HasPrefix .Destination "http" }} target="_blank" rel="noopener"{{ end }}>{{ .Text | safeHTML }}</a>
```

You'll find that the links now open in a new tab!
For internal blog links (which you would want to open in the same tab), you can use the relative link of the post, e.g. for an `other-post.md` file within the `posts` directory, you could use

```markdown
[Other post](/posts/other-post/)
```

---
If I’ve missed something or made a horrible mistake if you have any questions regarding this article then feel free to ping me on Twitter. I’m
[@aaqaishtyaq](https://twitter.com/aaqaishtyaq).
