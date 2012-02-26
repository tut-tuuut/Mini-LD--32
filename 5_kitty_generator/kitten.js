var myGame = function($, undefined) {
    $(document).ready(function() {
        // kitten-generation possibilities
        var furrs = ['grey', 'white', 'brown', 'orange'];
        var decos = ['marb', 'tache', 'ray', 'white'];
        var eyes  = ['blue', 'green', 'yell', 'white'];

        // Kitten's constructor
        var getNewKitten = (function() {
            var __number = 0; // global number of kittens
            var __defaultFurr = 'grey';
            var __defaultDeco = 'marb';
            var __defaultEyes = 'blue';

            return function(params) {
                if (!params) {
                    params = {}
                }
                var _container, _caracs;
                __number++;
                var kitten = {
                    furr : params.furr || furrs[utils.randInteger(0, furrs.length - 1)],
                    deco : params.deco || decos[utils.randInteger(0, decos.length - 1)],
                    eyes : params.eyes || eyes[utils.randInteger(0, eyes.length - 1)],
                    getKittenNumber : function() {
                        return __number;
                    },
                    draw : function() {
                        // My kitten has divitis. :'(
                            // (or is it me? Oh.)
                        var container = $('<div><div><div></div></div><span class="e"></span></div>');
                        container
                            .addClass('k')
                            .addClass('f-' + this.furr)
                            .addClass('d-' + this.deco)
                            .addClass('e-' + this.eyes);
                        return container;
                    }
                };
                return kitten;
            }
        })();

        // Utils
        var utils = {
            randInteger : function(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min); // Thanks @fetard :p
            }
        };

        // protected variables used by game object
        var _game = {
            score : 0,
            gameStates : {
                BEFORE  : 0,
                PLAY    : 1,
                WON     : 2
            },
            state : 0,
            justClicked : '',
            model : {},
            newModel : function() {
                this.model = getNewKitten();
                game.modelContainer.html(this.model.draw());
            },
            addToScore : function(points) {
                this.score += points;
                game.scoreContainer.html(this.score);
            }
        }

        // Public game object
        var game = {
            container : $('#theGame'),
            modelContainer : $('#model'),
            choicePlate : $('#choicePlate'),
            scoreContainer : $('#score'),
            testRegexps : {
                furr: /f-([a-z]+)/,
                eyes: /e-([a-z]+)/,
                deco: /d-([a-z]+)/,
            },
            init : function() {
                var i, j, kittens, choiceContent, kittyContent;
                // Draw choices of possible kittens -----------------------
                kittens = [];
                for(var f = 0; f < furrs.length; f++) {
                    for (var d = 0; d < decos.length; d++) {
                        for (var e = 0; e < eyes.length; e++) {
                            kittens.push(getNewKitten({
                                furr : furrs[f],
                                deco : decos[d],
                                eyes : eyes[e]
                            }));
                        }
                    }
                }
                for (i = 0; i < kittens.length; i++) {
                    j = utils.randInteger(0, kittens.length - 1);
                    // you can do it by using randInteger(i + 1, tiles.length - 1)
                    // to save resources on big arrays.
                    while (j == i) {
                        j = utils.randInteger(0, kittens.length - 1);
                    }
                    buff = kittens[j];
                    kittens[j] = kittens[i];
                    kittens[i] = buff;
                }

                choiceContent = $('<div></div>');
                for (i = 0; i < kittens.length; i++) {
                    var kittyContent = kittens[i].draw();
                    choiceContent.append(kittyContent);
                }
                this.choicePlate.append(choiceContent);
                // Bind click on kittens of place choice -----------------------------
                this.choicePlate.on('click.meaow', '.k', function() {
                    _game.justClicked = $(this).attr('class');
                    game.compareClickedAndModel();
                });
                // Bind "begin" button -----------------------------------------------
                $('#beginButton').on('click.meaow', function() {
                    _game.newModel();
                    _game.state = _game.gameStates.PLAY;
                });
            },
            compareClickedAndModel : function() {
                var furr = this.testRegexps.furr.exec(_game.justClicked);
                var eyes = this.testRegexps.eyes.exec(_game.justClicked);
                var deco = this.testRegexps.deco.exec(_game.justClicked);
                if (furr && eyes && deco) {
                    if (    _game.model.furr == furr[1]
                        &&  _game.model.deco == deco[1]
                        &&  _game.model.eyes == eyes[1]) {
                        _game.newModel();
                        _game.addToScore(10);
                    } else {
                        //TODO losing message
                        _game.addToScore(-1);
                    }
                }
            }
        };
        game.init();
        myGame = game;
    });
}(jQuery);