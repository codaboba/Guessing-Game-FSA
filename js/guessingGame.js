
function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

function generateWinningNumber() {
    return Math.floor(Math.random()*100) + 1;
}

function newGame() {
    return new Game();
}

Game.prototype = {
    difference: function () {
        return Math.abs(this.winningNumber - this.playersGuess);
    },
    isLower: function() {
        return this.playersGuess < this.winningNumber;
    },
    playersGuessSubmission: function(guess) {
        if (isNaN(guess) || guess < 1 || guess > 100) {
            throw new Error("That is an invalid guess.");
        }
        
        this.playersGuess = guess;
        const self = this;
        const result = this.checkGuess(guess);
        const winner = this.pastGuesses.indexOf(this.winningNumber) > -1;
        const duplicate = "You have already guessed that number.";
        const gameOver = this.pastGuesses.length === 5 || winner;

        if (gameOver) {
            disableButtons();
            showPastGuesses();
        } else if (result !== duplicate) {
            showPastGuesses();
        }
        updateH1();
        updateH2();

        function showPastGuesses() {
            const emptyGuess = $('#guesses').find('.empty-guess').first();
            emptyGuess.text(guess);
            emptyGuess.removeClass('empty-guess');
        }
        function disableButtons() {
            $('#hint, #submit').prop('disabled', true);
        }
        function updateH1() {
            $('h1').text(result);
            if (!winner) {
                $('#player-input').val("");
            }
        }
        function updateH2() {
            if (gameOver) {
                $('h2').text("'Reset' to start over");
            } else if (result === duplicate) {
                $('h2').text("Try again");
            } else if (self.isLower(guess)) {
                $('h2').text("Guess higher");
            }  else {
                $('h2').text("Guess lower");
            }
        }
    },
    checkGuess: function(num) {
        if (this.pastGuesses.includes(num)) {
            return "You have already guessed that number.";
        }
        this.pastGuesses.push(num);

        if (num === this.winningNumber) {
            return "You Win!";
        }

        if (this.pastGuesses.length < 5) {
            if (this.difference() < 10) {
                return "You're burning up!";
            } 
            if (this.difference() < 25) {
                return "You're lukewarm."
            }
            if (this.difference() < 50) {
                return "You're a bit chilly."
            }
            return "You're ice cold!"
        }
        return "You Lose."
    },
    provideHint: function() {
        return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
    }
}

function shuffle(arr) {
    let len = arr.length, randomIndex;
    
    while(len) {
        randomIndex = Math.floor(Math.random() * len--);
        [arr[len], arr[randomIndex]] = [arr[randomIndex], arr[len]];
    }

    return arr;
}

function makeAGuess(game) {
    const guess = +$('#player-input').val();
    game.playersGuessSubmission(guess)
}

function reset() {
    $('h1').text('Play the Guessing Game!');
    $('h2').text('Guess a number between 1 and 100');
    $('#player-input').val("");

    const li = $('li').not('.empty-guess');
    li.text('-');
    li.addClass('empty-guess');

    enableButtons();
    function enableButtons() {
        $('#hint, #submit').prop('disabled', false);
    }
}

$(document).ready(function() {
    let game = newGame();

    $('#submit').click(function(e) {
        makeAGuess(game);
    });

    $('#player-input').keypress(function(e) {
        if (e.which === 13) {
            if (game.pastGuesses.indexOf(game.winningNumber) === -1 && game.pastGuesses.length < 5) {
                makeAGuess(game);
            }
        }
    });

    $('#reset').click(function(e) {
        game = newGame();
        reset();
    })

    $('#hint').click(function(e) {
        $('h1').text('Pssst... ( ͡° ͜ʖ ͡°)');
        $('h2').text(game.provideHint().join(', '));
        $('#hint').prop("disabled", true);
    });
});