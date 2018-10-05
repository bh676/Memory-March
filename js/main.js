//Javascript
const imageCard = document.getElementsByClassName('img-square');
const coverCard = document.getElementsByClassName('game-square');

//Disable double clicking to prevent speedy matching
//of one card only!!
$(document).ready(function() {
  $(document).on('dblclick', function(e) {
    e.preventDefault();
  });
});

//Start game
$(document).ready(function() {

  //On click of Start button load the board
  $('#start-button').on('click', function(e) {
    e.preventDefault();

    $('.instructions-wrapper').fadeOut(1000, function() {
      $('.board-container').load('board.html', function() {
        //Turns, points, and board fade in
        $('#points-track').css('opacity', '1');
        $('#turns-track').css('opacity', '1');
        $('.container').animate({
          opacity: 1
        }, 300, function() {

          //Randomize the cards------------------------------
          //Class names stored in array. 6 of each for 60 squares
          var fruitClass = [
            'apple', 'banana', 'cherry', 'grapes', 'pineapple', 'strawberry', 'watermelon', 'pear', 'orange', 'blueberry',
            'apple', 'banana', 'cherry', 'grapes', 'pineapple', 'strawberry', 'watermelon', 'pear', 'orange', 'blueberry',
            'apple', 'banana', 'cherry', 'grapes', 'pineapple', 'strawberry', 'watermelon', 'pear', 'orange', 'blueberry',
            'apple', 'banana', 'cherry', 'grapes', 'pineapple', 'strawberry', 'watermelon', 'pear', 'orange', 'blueberry',
            'apple', 'banana', 'cherry', 'grapes', 'pineapple', 'strawberry', 'watermelon', 'pear', 'orange', 'blueberry',
            'apple', 'banana', 'cherry', 'grapes', 'pineapple', 'strawberry', 'watermelon', 'pear', 'orange', 'blueberry'
          ];

          //Shuffle the above array
          const fruitRand = fruitClass.sort(function() {
            return 0.5 - Math.random();
          });

          //Loop through each .img-square element, and assign it a
          //corresponding class name from the shuffled array
          for (i=0; i < imageCard.length; i++) {
            imageCard[i].classList.add(fruitRand[i]);
          };//End Randomize cards-------------------------

          //Track clicks and check for matches------------
          var click = 0;
          var selectedSquares = [];
          var flippedCards = [];
          var matches = 0;
          var points = 0;
          var turns = 20;
          var totalMatches = 0;

          //Select a card
          $('.game-square').on('click', function() {
            click = click + 1;
            let selectedClass = $(this).parent().attr('class');
            let selectedCards = $(this).parent();

            //Push parent class name to selectedSquares
            //And parent element to flippedCards
            selectedSquares.push(selectedClass);
            flippedCards.push(selectedCards);

            //Temporarily disable clicking on the same card twice
            $(this).css('pointer-events', 'none');

            //slide card over to reveal image
            $(this).animate({
              'right': '110%'
            }, 50);

            //re-enable clicking after animation completes
            setTimeout(function() {
              $(this).css('pointer-events', 'auto');
            }, 50);

            //If/else to check if two selected card classes match
            //If cards match:
            if (click == 2 && selectedSquares[0] == selectedSquares[1]) {
              //Cards stay turned over and turn green
              flippedCards[0].addClass('match');
              flippedCards[1].addClass('match');

              click = 0;
              selectedSquares = [];
              flippedCards = [];
              matches = matches + 1;
              totalMatches = totalMatches + 1;

              //Check number of consecutive matches and gain points/turns
              if (matches == 1) {//One match
                points = points + 100;
                turns = turns + 1;
                $('#points-track').html(`${points}`);
                $('#turns-track').html(`${turns}`);
                $('.points').addClass('flash');
                $('.turns').addClass('flash');

                setTimeout(function() {
                  $('.points').removeClass('flash');
                  $('.turns').removeClass('flash');
                }, 1200);
              }; //Close one match

              if (matches == 2) {//Two matches in a row
                points = points + 250;
                turns = turns + 2;
                $('#points-track').html(`${points}`);
                $('#turns-track').html(`${turns}`);
                $('.points').addClass('flash');
                $('.turns').addClass('flash');
                $('#two').addClass('bounce');

                setTimeout(function() {
                  $('.points').removeClass('flash');
                  $('.turns').removeClass('flash');
                }, 1200);

                setTimeout(function() {
                  $('#two').removeClass('bounce');
                }, 2000);
              }; //Close two matches

              if (matches == 3) {//Three matches in a row
                points = points + 500;
                turns = turns + 3;
                $('#points-track').html(`${points}`);
                $('#turns-track').html(`${turns}`);
                $('.points').addClass('flash');
                $('.turns').addClass('flash');
                $('#three').addClass('bounce');
                matches = 0; //reset matches after 3 in a row

                setTimeout(function() {
                  $('.points').removeClass('flash');
                  $('.turns').removeClass('flash');
                }, 1200);

                setTimeout(function() {
                  $('#three').removeClass('bounce');
                }, 2000);
              }; //Close three matches

              //Total matches check for game win -------------
              if (totalMatches == 30) {
                $('#end-heading').append(` Win!`);
                $('#end-points').append(` ${points} points.`);

                //Screen darkens and win message appears
                $('.board-container, header, footer').css({
                  'animation-name': 'darken',
                  'animation-delay': 0,
                  'animation-duration': '2s',
                  'animation-timing-function': 'linear',
                  'animation-iteration-count': 1
                });

                setTimeout(function() {
                  $('.board-container, header, footer').css('filter', 'brightness(20%)');
                  $('.game-end').css(
                    'display', 'initial'
                  );
                }, 2000);
              }//Close win check -------------

            //If cards don't match:
            } else if (click == 2 && selectedSquares[0] != selectedSquares[1]) {
              //Temporarily disable flipping further cards during animation
              $('.game-square').css('pointer-events', 'none');
              //Lose a turn
              turns = turns - 1;

              //Cards flip back over after 1.2 seconds, turns update
              setTimeout(function() {
                flippedCards[0].children().animate({
                  'right': 0
                }, 50)
                flippedCards[1].children().animate({
                  'right': 0
                }, 50)

                click = 0;
                selectedSquares = [];
                flippedCards = [];
                matches = 0;
                $('#turns-track').html(`${turns}`);
              }, 1200);

              //Check if out of turns, if so lose the game-------
              if (turns == 0) {
               $('#end-heading').append(` Lose!`);
               $('#end-points').append(` ${points} points.`);

               //Screen darkens and lose message appears
               $('.board-container, header, footer').css({
                 'animation-name': 'darken',
                 'animation-delay': 0,
                 'animation-duration': '2s',
                 'animation-timing-function': 'linear',
                 'animation-iteration-count': 1
               });

               setTimeout(function() {
                 $('.board-container, header, footer').css('filter', 'brightness(20%)');
                 $('.game-end').css(
                   'display', 'initial'
                 );
               }, 2000);
             } else { //re-enable flipping if not yet out of turns
               setTimeout(function() {
                 $('.game-square').css('pointer-events', 'auto');
               }, 1200);
             }; //Close game lose check----

            };//Close if/else match check

          });//Close game square click

          //End click/match tracking------------------------------

        });//End board fade in
      });//End board load function
    });//End instructions fade out
  });//End Start button click

});//Close load board ready

//Play again button
$(document).ready(function() {
  $('.play-again').on('click', function(e) {
    e.preventDefault();

    window.location.replace('index.html');
  });//Close play again click
});//Close play again ready
