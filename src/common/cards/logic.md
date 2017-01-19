# Thought process of logic required for the triple triad solver


### Inputs required
1) entire player's deck (or x)  
2) entire opponent's deck (or y)  
3) ruleset  

### Calculating possibilities from decks
- xC5 where 5 <= x <= 168
  - 1 million possibilities (but actually limited by the only 1 4/5* card rule)
- yC5 where 5 <= y <= 8
  - 156 possibilities
  - 5 cards from player
  - 5 cards from opponent

### Rulesets that affect possibilities
- All Open
  - y = 5
  - 1 possibility

- Three Open
  - yC2 where 2 <= y <= 5
  - 10 possibilities

- Sudden Death
  - Recursion nightmare

- Random, Swap
  - calculate on fly

- Order
  - take away 5!
  - resulting in 43 million possibilities

- Chaos
  - as normal (we cannot tell in advance what will be selected for Chaos)

-  Reverse, Fallen Ace, Same, Plus, Ascension, Descension
  - only grid the outcome

# Grid possibilities
9 rounds  
5x9 possibilities  
5x8 possibilities  
4x7 possibilities  
4x6 possibilities  
3x5 possibilities  
3x4 possibilities  
2x3 possibilities  
2x2 possibilities  
1x1 possibilities  
5!*5!*9!  
5.2 billion possibilities XD  

A1 a2 B3 b4 C5 c6 D7 d8 E9 = ??? win/draw/loss