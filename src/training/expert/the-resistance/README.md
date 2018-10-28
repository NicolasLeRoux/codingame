# The Resistance

## Goals

You work in the National Resistance Museum and you just uncovered hundreds of
documents which contain coded Morse transmissions. In the documents, none of the
spaces have been transcribed to separate the letters and the words hidden behind
the Morse sequence. Therefore, there may be several interpretations of any single
decoded sequence.

Your program must be able to determine the number of different messages that it’s
possible to obtain from one Morse sequence and a given dictionary.

## Rules

Morse is a code composed of dots and dashes representing the letters of the
alphabet. Here is the transcription of an alphabet in Morse:

| Letter | Morse code |
|:------:|:----------:|
| A | .- |
| B | -... |
| C | -.-. |
| D | -.. |
| E | . |
| F | ..-. |
| G | --. |
| H | .... |
| I | .. |
| J | .--- |
| K | -.- |
| L | .-.. |
| M | -- |
| N | -. |
| O | --- |
| P | .--. |
| Q | --.- |
| R | .-. |
| S | ... |
| T | - |
| U | ..- |
| V | ...- |
| W | .-- |
| X | -..- |
| Y | -.-- |
| Z | --.. |

Since none of the spaces have been transcribed, there may be several possible
interpretations. For example, the sequence `-....--.-.` could be any of the
following: `BAC`, `BANN`, `DUC`, `DU TETE`, ...

A human being can recognize where the segmentations should be made due to their
knowledge of the language, but for a machine, it’s harder. In order for your
program to do the same, you are given a dictionary containing all of the right
words.

However, even with a dictionary, it’s possible that a sequence might correspond
to several valid messages (`BAC`, `DUC`, `DU` and `TETE` might be present in the
dictionary of the previous example).

> Source: ACM Contest Problems Archive

## Game Input

### Input

__Line 1:__ a Morse sequence with a maximum length `L`.

__Line 2:__ an integer `N` corresponding to the number of words in the dictionary

__The N following lines:__ one word from the dictionary per line. Each word has
a maximum length `M` and only appears once in the dictionary.

### Output

An integer `R` corresponds to the number of messages that it is possible to
generate with the Morse sequence and the dictionary.

### Constraints

0 < `L` < 100000
0 < `N` < 100000
0 < `M` < 20
0 ≤ `R` < 2^63

## Annex

### What will I learn

__Recursion__, __Memoization__, __Encoding__ and __Dynamic Programming__.

In this puzzle you manipulate strings, substrings and characters.

You have to handle a large number of possible combination and permutations.

You need to use optimized algorithm techniques like dynamic programming and more
specifically divide and conquer.

External resources:
- [Strings](https://en.wikipedia.org/wiki/String_(computer_science))
- [Recursion](https://en.wikipedia.org/wiki/Recursion_(computer_science))
- [Memoization](https://en.wikipedia.org/wiki/Memoization)
- [Dynamic programming](https://en.wikipedia.org/wiki/Dynamic_programming#Dynamic_programming_in_computer_programming)
- [Divide and conquer](https://en.wikipedia.org/wiki/Divide_and_conquer_algorithm)

### Statement

In this puzzle, your program must be able to determine the number of different
messages that it’s possible to obtain from one Morse sequence and a given
dictionary. Even if it looks simple, there are many possibilities and only an
optimized algorithm can compute long sentences.

### Story

Beep. Beeeep. Beep. Beep.
The national museum of the resistance stores a large amount of messages exchanged
during the war, but they are all encoded in Morse code. As the new intern of the
museum, you get to do the boring work and have to decypher the messages. Let's
write a program that will do the job in your place ;) .
Beep. Beeeep. Beeeep. Beep.
