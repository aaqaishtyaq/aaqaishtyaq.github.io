---
layout: post
title: "Algorithms in Python: Quick Sort"
---

## Theory

Quicksort is a "divide and conquer" type of algorithm. The good thing about
it is that the worst case can almost always be avoided by using what is called a
randomized version of quicksort (more on that later).

The idea of Quicksort is to take an unsorted list and select an element (on that
list) called a "pivot". Then the list is rearranged such that all elements greater
(in value) than the pivot are placed to its right, and all elements lesser (in
value) are placed to its left.

This process is called partitioning. At this stage in the execution of the
algorithm, the order of the elements doesn't really matter so long as the
lesser/bigger values are placed in the correct side of the pivot.

Partitioning will produce two sublists with the pivot as a separator (
this is because the pivot will be at its natural place after the first pass aka
sorted). The problem then becomes sorting these two sublists.

*Note: Partitioning does not require creating copies of the
list, we work on it directly as long as we keep track of the start and end
indices of each sublist.*

To sort the two sublists, we can apply the same logic as above (choosing a
pivot, and sort the two resulting sublists) because QuickSort is a recursive
algorithm.

When a sublist only contains a single element, it's already sorted so we can
stop the recursion at this point, it's our exit condition.

**Note on choosing a pivot**

Some people use the last item of the list, some people use the median of the
first, last, and medium elements but the most common way is to choose a random
pivot to ensure `n log n` execution.

## Some Code

```python
def swap_values(lst, val1, val2):
    lst[val1], lst[val2] = lst[val2], lst[val1]

def quicksort(array, start, end):

    if start < end:

        partition_index = partition(array, start, end) #
        quicksort(array, start, partition_index - 1)
        quicksort(array, partition_index + 1, end)

def partition(array, start, end):

    pivot = end
    partition_index = start

    for i in range(start, end):

        if array[i] < array[pivot]:
            print("{} is less than {}".format(array[i], array[pivot]))
            swap_values(array, partition_index, i)
            partition_index += 1

    array[pivot], array[partition_index] = array[partition_index], array[pivot]
    return partition_index
```

A randomized version of quicksort would look similar to what's above except that
we must randomize the selection of our pivot.

```python
import random
# ...
def partition(array, start, end):
    if start < end:
        pivot = random.randint(start, end)
        array[end], array[pivot] = array[pivot], array[end]
        partition_index(array, start, end)
        # ...
```
Here, we set the pivot to a random integer in the range between `start`
and `end`. Then, we swap the value at that index with the value at array[end].
If you run the code successively, you'll notice that the pivot is
different every time. It's a nice optimisation that can save some time.

## Time Complexity

It's one of the most efficient sorting algorithm. In fact, most sorting
functions that come packaged in many language's standard libraries use an
implementation of QuickSort.

The order of growth for QuickSort in the worst case is quadratic O(n^2). The
average case however, which is the most common scenario, has a complexity of
O(n log n).

QuickSort works best when used on large sets of data because of it's recursive
nature.
