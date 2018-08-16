---
layout: post
title: "Algorithms in Python: Bubble Sort"
---

## Some theory

Bubble sort is another commonly known sorting algorithm. The idea here is to
scan a list of items (say integers) sequentially (from left to right) and
compare consecutive pairs of elements starting at index 0.

Example:
```python

my_numbers = [92,11,45,2234,0,7,65]
# 92 is index 0 and the consecutive pairs are
# (92,11), (11,45), (45,2234) and so on ...
```
At first we compare elements (list[0],list[1]) then (list[1],list[2]) then
(list[2],list[3]) and so on until the end of the list is reached.

When comparing we check if element i is greater than element i + 1, if they are
we just swap the two elements and move on to the next pair. If they are not this
means that the pair is already sorted, so we also move on to the next pair.

Example:
```python
my_numbers = [92,11,45,2234,0,7,65]

# Let's compare my_numbers[0] and my_numbers[1]
if my_numbers[0] > my_numbers[1]:
    swap(my_numbers[0], my_numbers[1])

print(my_numbers) # [11, 92, 45, 2234, 0, 7, 65]
```

This process has to be repeated for however many items are in the list. So if
the list holds 9 items, it means we need to loop through it 9 times at most.
But what if our original list is partially sorted ? We might not need 9 passes
through the list.

One way for us to know that the list is fully sorted is if we have made no
swaps during our pass. For that we need a variable to keep track of how many
swaps were made during a pass.

Example:
```python
my_numbers = [92,11,45,2234,0,7,65]

# Elements (0,1) are compared and swapped. List is now 11,92,45,2234,0,7,65
# Elements (1,2) are compared and swapped. List now 11,45,92,2234,0,7,65
# Elements (2,3) are compared and not swapped. List remains the same.
# Elements (3,4) are compared and swapped. List is now 11,45,92,0,2234,0,7,65
# Elements (4,5) are compared and swapped. List is now 11,45,92,0,7,2234,65
# Elements (5,6) are compared and swapped. List is now 11,45,92,0,7,65,2234

# This represents one unique pass through the list.
```

Notice how after each pass the highest value number is pushed at len(list) - 1.

## Some code

Let's look at how to implement Bubble Sort using Python:

```python
def bubble_sort(some_list):

    is_sorted = False

    while not is_sorted:

        is_sorted = True

        for i in range(0, len(some_list) - 1):

            if some_list[i] > some_list[i + 1]:

                some_list[i], some_list[i+1] = some_list[i+1], some_list[i]
                is_sorted = False
```
This works right and it will sort any list you throw at it. However we can
slightly optimise it: We know that, after each pass the highest value element is
guaranteed to be sorted and placed at len(some\_list) - 1. Because of this, for
each subsequent pass, we can stop comparing at the last sorted item. instead of
comparing pairs that we know are already sorted.

This is how it looks like:

```python
def bubble_sort(some_list):

    is_sorted = False
    last_sorted_item = len(some_list) - 1

    while not is_sorted:

        is_sorted = True

        for i in range(0, last_sorted_item):

            if some_list[i] > some_list[i + 1]:

                some_list[i], some_list[i+1] = some_list[i+1], some_list[i]
                is_sorted = False

        last_sorted_item -= 1
```

After each pass through the loop, we know the right side of the list is sorted
so we decrement the value of last\_sorted\_item. What this means is that the 1st
pass will loop from 0 to len(some\_list) -1, the second time, it will be from 0
to len(some\_list) - 2 and so on ...

## Time complexity

The rate of growth of this algorithm is quadratic. Expressed as O(n^2) in
"big-oh" notation.

```python
def bubble_sort(some_list):

    is_sorted = False                       # time here is constant
    last_sorted_item = len(some_list) - 1

    while not is_sorted: # We go through this first loop n times

        is_sorted = True

        for i in range(0, last_sorted_item): # we go through this loop n-1 times

            if some_list[i] > some_list[i + 1]:

                # execution here is constant
                some_list[i], some_list[i+1] = some_list[i+1], some_list[i]
                is_sorted = False

        last_sorted_item -= 1 # constant time
```

It's O(n^2) because for each pass through the loop n times, we loop n times
through the consecutive pairs. It's obviously not a very efficient algorithms
when used on large samples of data. It should really only be used if you have a
specific case on a small data set.

Next in the series is QuickSort, another interesting and more efficient sorting
algorithm. As always, if you have questions, comments or if you spotted a typo
or a mistake, please feel free to let me know on twitter, I'm
[@aaqaishtyaq](https://twitter.com/zabanaa) and always happy to help !
