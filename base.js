// You are to create a card game for 4 players. The players each draw a card from the deck each round. The player who draws the highest card will win the round and score a point. When there are no more cards left in the deck, the game should end with a scoreboard that displays the players ranked in order of the total number of points they have scored.

// The product team is impressed with your product and takes it to market for initial validation. They return with a list of revisions they would like to make:

// They would like more than 4 players in the game.
// All players who draw the card must now show the card.
// Subsequent players are allowed to skip the round.
// There are now two decks of playing cards available per game

// 2 same card. tie round = 0 point

// How would you update your implementation to accommodate these features?

const getArgs = () => {
    var arr = {};
    var last;
    process.argv.forEach((a, idx) => {
        if (idx > 1) {
            if (last) {
                arr[last] = a;
                last = undefined;
            }
            else if (!last && a.match(/-\w+/))
                last = a;
        }
    })
    return arr;
}


const compareComplexDeck = (a, b) => {
    let aCard = a?.currentCard ?? a;
    let bCard = b?.currentCard ?? b;

    if (aCard?.number > bCard?.number) {
        return -1;
    } else if (aCard?.number < bCard?.number) {
        return 1;
    } else {
        if (aCard?.shape > bCard?.shape) {
            return -1;
        } else {
            return 1;
        }
    }
}

const main = () => {
    const args = getArgs(process.argv);
    args['-player'] = args['-player'] ?? 4;
    console.log(args['-player'], 'players have been configured for this game play');
    args['-deck'] = args['-deck'] ?? 1;
    console.log(args['-deck'], 'decks have been configured for this game play');

    // to test for draw case
    args['-testForDraw'] = args['-testForDraw'] ?? 0;
    console.log('Test for Draw:', args['-testForDraw']);


    // const simpleDesk = Array.from(Array(52).keys()).sort(() => .5 - Math.random());
    // console.log(simpleDesk);

    let complexDesk = []
    if (args['-testForDraw'] == 1) {
        complexDesk = [
            { number: 1, shape: 'B' },
            { number: 1, shape: 'D' },
            { number: 1, shape: 'D' },
            { number: 1, shape: 'A' },
            { number: 1, shape: 'A' },
            { number: 1, shape: 'B' },
            { number: 1, shape: 'C' },
            { number: 1, shape: 'C' }
        ];
    } else {
        for (let j = 0; j < args['-deck']; j++) {
            for (let i = 0; i < 13; i++) {
                complexDesk.push({
                    number: i + 1,
                    shape: 'A'
                })
                complexDesk.push({
                    number: i + 1,
                    shape: 'B'
                })
                complexDesk.push({
                    number: i + 1,
                    shape: 'C'
                })
                complexDesk.push({
                    number: i + 1,
                    shape: 'D'
                })
            }
        }
        complexDesk.sort(() => .5 - Math.random());
    }
    console.log('=====Cards In Deck=====\n', complexDesk);


    const players = []
    for (let i = 0; i < args['-player']; i++) {
        players.push({
            name: `Player ${i + 1}`,
            totalScore: 0,
            currentNumber: 0,
            currentCard: {},
        })
    }

    do {
        console.log('\n=====ROUND=====')
        // Reset all to 0. and issue a new card
        players.sort((a, b) => a.name > b.name ? 1 : -1);

        for (let p of players) {
            // p.currentNumber = 0;
            // p.currentNumber = simpleDesk.pop();

            p.currentCard = {};
        }

        let highestCardFlag = false;
        // Check what is the current highest card.
        let sortedHighestCard = [...complexDesk].sort(compareComplexDeck)[0]

        for (let p of players) {
            let cardIssued = complexDesk.pop();

            if (cardIssued && cardIssued.number === sortedHighestCard.number && cardIssued.shape === sortedHighestCard.shape) {
                p.currentCard = cardIssued;
                highestCardFlag = true;
            }
            console.log('Card Issued to', p.name, ':', cardIssued, '[IsHighestCard :', highestCardFlag + ']')
            if (highestCardFlag)
                break;

            if (complexDesk.length > 0 && highestCardFlag === false)
                p.currentCard = cardIssued ?? {};
        }

        // players.sort((a,b) => a.currentNumber > b.currentNumber ? -1 : 1);
        players.sort(compareComplexDeck);
        // make sure its not a draw
        if (players.length > 2 && JSON.stringify(players[0].currentCard) != JSON.stringify(players[1].currentCard)) {
            players[0].totalScore += 1;
            console.log('=====Winner=====\n', players[0])
        } else {
            console.log('=====No Winner=====');
        }

    } while (complexDesk.length > 0)

    players.sort((a, b) => a.totalScore > b.totalScore ? -1 : 1);
    console.log('\n\n=====Overall Result Scoreboard=====\n', players.map(s => {
        return { name: s.name, totalScore: s.totalScore }
    }));

    // Show all winners with same highest point
    let maxTotalScore = players.map(s => s.totalScore).sort((a, b) => a > b ? -1 : 1)[0];
    console.log('=====Overall Winner=====\n', players.filter(s => s.totalScore == maxTotalScore))
}

main()