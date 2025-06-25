# Tak: A Beautiful Game 
This is a simple web implementation of the abstract board game Tak. The goal of the game is to make a road of stones from one end of the board to the other.

Link to project: insert link

insert image

## Challenges 
I faced many challenged in the 18 hours that I spent developing this project, and I had to make some comprimises. Tak is an extremely complex game with many mechanics and edge cases, and I tried to account for them as well as I could. 

Tak is also a 2 player game, so usually it would be played online with another person, however, I have zero experience with backend development, so exclusively local multiplayer is supported in this version. The hardest part of this project, though, would have to be implementing and debugging the stone movement system. It's very specific and has tons of rules that are difficult to implement, let alone debug.

## How I Made It: 
To make this project, I used basic HTML, CSS, and JavaScript.

At first, I started out with some basic CSS so my eyes wouldn't bleed during the rest of development, and this simple theme stuck throughout the whole time I made it. 
I made a test 4x4 board and defined a stack storage system. Then, I tried to implement placing stones, and that's when I realized that it's way out of reach for my skill level. I decided to settle for inputting PTN notation to make moves instead. I built a PTN notation parser, learning RegEx along the way. I also decided it was time to expand the board to the full 6x6 size and put in the different types of stones. I coded the ability to place stones, which was the easy part. 
Next, I had to tackle Tak's stack movement system, and I learned many things along the way while implementing this. Durinng this stage, it was bug after bug, but I pushed through and debugged for hours to get it working. At the end, I added a move list viewer, a quick description, and some important links for first-time Tak players. 
I'm honestly proud that I could get this project working at all, even with the comprimises. I definitely bit off more than I could chew, but I managed to complete it in the end.

Made with ❤️ by 🐡
