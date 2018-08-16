---
layout: post
title: The ultimate PostgreSQL cheatsheet
---

So I had been working with Django, Flask and Express.js for a while now, and my
database of choice for every single project has of course always been Postgres.
What makes these frameworks great (regardless of language) is the ability to use
an ORM (Object Relational Mapper) that sits between your code and the DB.
It does all the heavy lifting for you and takes care of executing SQL queries on
your behalf.

This is great but I couldn't stop thinking "what if I have to
manually debug something directly into postgres ?" This is when reality slapped
me in the face, I barely knew the SQL Language. So I thought It'd be fun to
create a cheatsheet that I (and you) could keep as a reference for these times
when you absolutely need to set this column to UNIQUE and you don't know how.

Enjoy ! (and yeah I went all in with the pokemon references)

### Create a User (or Role)

```sql
/* create a user without privileges*/
CREATE ROLE aaqa;

/* create a user with privileges*/
CREATE ROLE aaqa LOGIN CREATEDB CREATEROLE REPLICATION;

/* Add privileges to existing user*/
ALTER ROLE aaqa WITH LOGIN CREATEROLE CREATEDB REPLICATION;
```


### Make a user superuser (bump their privileges)

```sql
ALTER ROLE aaqa WITH superuser;
```


### Rename an existing user

```sql
ALTER ROLE psyduck RENAME TO brock;
```


### Create a DB

```sql
CREATE DATABASE pokemons;
```


### Rename a DB

```sql
ALTER DATABASE pokemons RENAME TO charizard;
```


### Create a table in a DB

```sql
CREATE TABLE trainers(

    id INT PRIMARY KEY NOT NULL,
    pokemon_type CHAR(50),
    name CHAR(50) NOT NULL UNIQUE,
    gender CHAR(50) NOT NULL UNIQUE
);
```


### Delete a DB

```sql
DROP DATABASE pokemons;
```


### Delete a user

```sql
/* assuming there's a pikachu role on the system */
DROP ROLE pikachu;
```


### Change DB ownership

```sql
ALTER DATABASE pokemons OWNER TO aaqa;
```


### Rename a table

```sql
ALTER TABLE trainers RENAME TO gym_trainers;
```


### Change column type

```sql
ALTER TABLE gym_trainers ALTER COLUMN pokemon_type TYPE TEXT; /* it makes zero
sense to want to change this column type to TEXT but YOLO */
```


### Rename a column

```sql
ALTER TABLE gym_trainers ALTER COLUMN name RENAME TO trainer_name;
```


### Add a column to a table

```sql
ALTER TABLE gym_trainers ADD COLUMN bio TEXT;

/*
ALTER TABLE <table_name>
ADD COLUMN <column_name> <data_type> <constraints if any>
*/
```


### Add a column with a UNIQUE constraint

```sql
ALTER TABLE gym_trainers ADD COLUMN age INT UNIQUE; /* cause why not */
```


### Add a column with a NOT NULL constraint

```sql
ALTER TABLE gym_trainers ADD COLUMN main_pokemon CHAR(60) NOT NULL;
```

### Remove NOT NULL CONSTRAINT from a column

```sql
ALTER TABLE gym_trainers ALTER COLUMN main_pokemon DROP NOT NULL;
```

### Add a column with a NOT NULL constraint and a DEFAULT value

```sql
ALTER TABLE gym_trainers ADD COLUMN city CHAR(80) NOT NULL DEFAULT 'Indigo
Plateau';
```


### Add a column with a CHECK constraint

```sql

CREATE TABLE trainers(

    id INT PRIMARY KEY,
    trainer_name CHAR(50) NOT NULL,

    /*
        method 1
        Add the check yolo style
    */
    age INT NOT NULL CHECK (age > 18)

    /*
        method 2
        Add a named constraint for better error handling
    */
    age INT CONSTRAINT legal_age CHECK (age > 18) NOT NULL

    /*
        method 3
        Add the constraint at the end
        for more clarity
    */
    age INT NOT NULL,
    CONSTRAINT legal_age CHECK (age > 18) NOT NULL
);
```


### Add a CONSTRAINT to an existing column

```sql
ALTER TABLE trainers ADD CONSTRAINT unique_name UNIQUE (trainer_name);
```

### Remove a named CONSTRAINT from a table

```sql
ALTER TABLE trainers DROP CONSTRAINT unique_name;
```

### Insert a row into a table

```sql
INSERT INTO trainers VALUES (1, 23, 'brock');

/* or */

INSERT INTO trainers (age, trainer_name)
VALUES (1, 23, 'brock');

/*
    Note that in the second case we don't have pass
    the id. Postgres will automatically generate and autoincrement
    it for us. To omit the id column we must use named inserts otherwise an
    error is raised.
*/
```


### Insert multiple rows into a table

```sql

INSERT INTO trainers (age, trainer_name) VALUES
(19, 'misty'),
(22, 'chen'),
/* ... */
/* ... */
```


### Clear a table (without deleting it)

```sql
TRUNCATE trainers;
```


### Set the primary key type to a serial (An auto incrementing integer)

```sql

/* Considering this table structure */

CREATE TABLE pokemon_list (

    id INT PRIMARY KEY,
    /* ... */
    /* ... */
    /* ... */
);


/*
    1.
    Create a sequence for the auto generating prinary key
    It follows the tablename_columnname_seq
*/
CREATE SEQUENCE pokemon_list_id_seq;

/* 2. Set the id column to not null */
ALTER TABLE pokemon_list ALTER COLUMN id SET NOT NULL;

/* 3. Set the default value to the next value in the sequence*/
ALTER TABLE pokemon_list
ALTER COLUMN pokemon_list
SET DEFAULT nextval('pokemon_list_id_seq');

/* 4. Link the sequence to the correct table and column */
ALTER SEQUENCE pokemon_list_id_seq OWNED BY pokemon_list.id;
```


### Import data from a file

```sql
/*
    Must use absolute path and the user must have appropriate permissions
    Defaults to importing using TAB as the default parameter.
    We'll use a csv file as an example
*/

COPY pokemon_list FROM '/path/to/yourfile.csv' DELIMITER ',';

/*
    This only works if a pk is specified for each row
    The (my) prefered way to do it is the following
*/

COPY pokemon_list (name, level, type) FROM '/path/to/yourfile.csv' DELIMITER ',';

/* It's much more flexible because you control what data you actually import*/
```


### Export a table to a file

To be able to export a table to a file, we need to ensure that postgres has
write permissions to the file.

```bash
sudo chmod 777 /path/to/directory # This is just an example, edit this as needed
```

We can now safely copy the table to the file.

```sql
COPY pokemon_list TO '/path/to/file.csv' DELIMITER ',';
```


### Select columns by using aliases

```sql
SELECT name AS pokemon_name, type AS pokemon_type
FROM pokemon_list;
```


### Select elements based on a criteria

```sql
SELECT *
FROM pokemon_list
WHERE id > 3;
```


### Select elements based on string comparison

```sql
SELECT *
FROM pokemon_list
WHERE type LIKE '%water%';
```


### Select all results and order them by id in reverse

```sql
SELECT *
FROM pokemon_list
ORDER BY id DESC;
```

### Select all results and order them by a column name

```sql
SELECT *
FROM pokemon_list
ORDER BY level;

/* If the column you're ordering by is not of type INT then the ordering will be
done alphabetically */
```

### Select DISTINCT column from table

```sql
SELECT DISTINCT type AS pokemon_type
FROM pokemon_list;
```

### Limit the results from a SELECT query

```sql
SELECT *
FROM pokemon_list
LIMIT 3;
```

### Select the last 3 items

```sql
SELECT *
FROM pokemon_list
ORDER BY id DESC
LIMIT 3;
```

### Create two tables with a foreign key relationship

```sql
CREATE TABLE pokemon_types(

    id SERIAL PRIMARY KEY,
    type_name CHAR(120) NOT NULL
)

CREATE TABLE pokemon_list(

    id serial PRIMARY KEY,
    pokemon_name CHAR(120) NOT NULL,
    pokemon_level INT NOT NULL,
    pokemon_type INT REFERENCES pokemon_types(id) NOT NULL,
    CONSTRAINT pokemon_level_not_zero CHECK (pokemon_level > 0)

);
```

### Perform Joins based on a criteria

```sql
SELECT name, level, pokemon_types.name AS type
FROM pokemon_list
JOIN pokemon_types
ON pokemon_type_id  = pokemon_types.id
WHERE pokemon_type_id = 1;

/* Will return the name, level and type name for all water pokemons */
```


### Perform joins

```sql
SELECT name, level, pokemon_types.name AS type
FROM pokemon_list
JOIN pokemon_types
ON pokemon_type_id  = pokemon_types.id;
```


### Create a VIEW based on a JOIN

```sql
CREATE VIEW pokemonswithtypes AS
SELECT name, level pokemon_types.name AS type
FROM pokemon_list
JOIN pokemon_types
ON pokemon_type_id = pokemon_types.id;

/* To see the data */

SELECT * FROM pokemonswithtypes;
```


### Update the VIEW (Change the query)

```sql
SELECT name, pokemon_types.name AS type
FROM pokemon_list
JOIN pokemon_types
ON pokemon_type = pokemon_types.id
WHERE pokemon_type = 1;

/* only show the name and type for water pokemons */
```


### Delete the VIEW

```sql
DROP VIEW pokemonswithtypes;
```


### Use aggregate functions (MIN, MAX, SUM, COUNT, AVG)

```sql
/* MAX */
SELECT MAX(pokemon_level)
FROM pokemon_list;

/* MIN */
SELECT MIN(pokemon_level)
FROM pokemon_list;

/* AVG */
SELECT AVG(pokemon_level)
FROM pokemon_list;

/* ROUND */
SELECT ROUND(AVG(pokemon_level))
FROM pokemon_list;

/* COUNT */
SELECT COUNT(*)
FROM pokemon_list;

/* SUM */
SELECT SUM(pokemon_level)
FROM pokemon_list;
```


### Use boolean aggregate functions

```sql
/* Add a column is_legendary of type boolean to table pokemon_list */
ALTER TABLE pokemon_list ADD COLUMN is_legendary BOOL NOT NULL DEFAULT TRUE;

/*  BOOL_AND
    returns a result if **ALL** records have that column set to true
*/

SELECT BOOL_AND(is_legendary) FROM pokemon_list;


/*
    BOOL_OR
    returns a result if one or more records have that column set to true
*/

SELECT BOOL_OR(is_legendary) FROM pokemon_list;
```


### Update a table and change all column values

```sql
UPDATE pokemon_list
SET is_legendary = FALSE;
```


### Update a table and change value based on a criteria

```sql
UPDATE pokemon_list
SET is_legendary = TRUE
WHERE id = 2;
```


### Delete row with specific id

```sql
DELETE FROM pokemon_list WHERE id = 4
```


### Delete rows withing a range of ids

```sql
DELETE FROM pokemon_list
WHERE id BETWEEN 1 AND 4;
```


### Delete all rows

```sql
DELETE FROM pokemon_list;
```
_Note: The difference between DELETE and DROP or TRUNCATE is that the former can
be undone (rolled back) the latter can't_


### Alter a table to drop a CONSTRAINT if it exist

```sql
ALTER TABLE pokemon_types
DROP CONSTRAINT IF EXISTS unique_type_name;
```

### Comments

```sql
COMMENT ON TABLE pokemon_types is 'pokemon with types'

/* To display the comment, in psql simply run \dt+. It will return a description
column containing that comment. It's useful when working on a legacy database
for example*/

/* Please note that comments aren't exclusive to tables, they can be executed on
schemas and multiple other objects.*/
```

*Note: If you find errors, typos or would like to add new tips, feel free to
reach out to me on twitter. I'm [@aaqaishtyaq](https://twitter.com/aaqaishtyaq). Thank
you for reading ! And if you find this useful, share it with your friends and
coworkers !*
