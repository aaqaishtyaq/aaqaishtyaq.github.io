---
layout: post
title: Mind blowing psql tips for beginners
---

This article will list facts, tips and tricks about the psql client.
It will be updated as I learn more things. Feel free to suggest tips and other
infos to me on twitter, I'm [@zabanaa](https://twitter.com/aaqaishtyaq) (with an
underscore at the end)

## Some quick facts

psql supports command history like bash through the use of the up and down arrow keys

psql also supports tab completion

inside the shell, sql statements must terminate with a semicolon and can also
  wrap lines.

defaults to supplying the currently logged in user (if your username on the
  system is zabana, psql will attempt to log you in as zabana)

`psql --version` will return the client version. (Your postgres backend can be
  a different version although they usually match if you did a clean install)

by default, postgres installs 3 databases:
- postgres: user accounts, stats etc
- template0: the original vanilla DB
- template1: a copy of template0 may be extended and is used to generate new DBs (when you run createdb for example)

If you run `psql` without flags or options, it will attempt to log you in
  using $PGUSER if it's set. (Usually $PGUSER is set to postgres, which is a
  Super User, you can tell that by the hash symbol at the end of the prompt)

psql allows its users to combine multiple commands at the same time. They must be
  separated with whitespace and each command must be terminated with a
  semicolon;

## Some quick tips

List all databases for a given user and exit

```bash
psql -l -U <username>
```
_Note: if you have $PGUSER set as an environment variable, you don't have to
specify the -U flag as it will default to that one._

Execute SQL commands from a file

```bash
psql -U <user> -F <path/to/file>
```
Note: The results will be displayed to STDOUT

Execute SQL commands from a file with a prompt at each step (verify)

```bash
psql -U <user> -F <file.sql> -S
```

Select all columns in a table

```sql
table <table_name>;
/* Is an alias to SELECT * FROM <table_name>; */
```

Set a different `NULL` display characters.

```bash
\pset null 'Ø'
```

Display the query of a view.

```bash
\sv <view_name>;
```

Edit an existing view;
```bash
\ev <view_name>;

# will open your $EDITOR and let you write the new query.
# However you can't remove a column from the query, you'll get an error otherwise.
```

## Some Useful psql shell commands

* \h will return SQL specific help
* \h [sql-command] will return help for that specific SQL command
* \? will return **psql specific** help
* \q quits the shell
* \i [file] will execute SQL commands from that file
* \l will list all databases
* \l+ will return the same as above only with more detailed info
* \du[+] will return users on the system who are allowed to use postgres
* \ ! will execute the current user's $SHELL (bash, fish, zsh ...), to go back to
  psql just run exit.
* \ ! [shell-command] will execute that command inside $SHELL, non interactively.
  (meaning the command is issued and the result is displayed **inside** psql so
  you don't have to leave the context)
* \c will connect to a DB (and optionally another host)
* \d will show relations for a particular database (short for describe)
* \dS will show relations in the system (not just tables) **verify**
* \dg will list all availabl roles (aka users)
* \dg+ will also reveal the descriptions for each role
* \dt will list tables inside a database
* \password [username] will change the password for [username]
* \conninfo will display relevant info about the current connection
* \e will open vim and allow you to write a query that will be immediately
executed upon save.





