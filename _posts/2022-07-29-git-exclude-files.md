---
layout: post
title: Git exclude files from working copy
---

## How to ignore new files

### Globally

Add the path(s) to your file(s) which you would like to ignore to your `.gitignore` file (and commit them). These file entries will also apply to others checking out the repository.

### Locally

Add the path(s) to your file(s) which you would like to ignore to your `.git/info/exclude` file. These file entries will only apply to your local working copy.

## How to ignore changed files (temporarily)

In order to ignore changed files to being listed as modified, you can use the following git command:

```console
git update-index --assume-unchanged <file-1> <file-2> <file-3>
```

To revert that ignorance use the following command:

```console
git update-index --no-assume-unchanged <file-1> <file-2> <file-3>
```

*Note: If you find errors, typos or would like to add new tips, feel free to
reach out to me on twitter. I'm [@aaqaishtyaq](https://twitter.com/aaqaishtyaq). Thank
you for reading ! And if you find this useful, share it with your friends and
coworkers !*
