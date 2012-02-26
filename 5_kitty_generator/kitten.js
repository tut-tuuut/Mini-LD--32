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
                var _container, _caracs;
                __number++;
                var kitten = {
                    furr : params.furr || __defaultFurr,
                    deco : params.deco || __defautlDeco,
                    eyes : params.eyes || __defaultEyes,
                    getKittenNumber : function() {
                        return __number;
                    },
                    draw : function() {
                        // My kitten has divitis. :'(
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
        // Public game object
        var game = {
            container : $('#theGame'),
            choicePlate : $('#choicePlate'),
            draw : function() {
                var i, j, kittens, choiceContent, kittyContent;
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
            },
        };
        game.draw();
        // Create tiles array
        
        /*
        var observer = function(){
            // Observe clicks on links
            // global game for debug/dev purpose
            var table = game.container.find('table');
            var colRegexp = /^col-([0-9]+)$/;
            var rowRegexp = /^row-([0-9]+)$/;
            var col, row;
            table.on('click.pouet', 'td', function(obj) {
                var o = $(this);
                if (o.hasClass('dead') || o.hasClass('turned')) {
                    return false;
                }
                col = false;row = false;
                var classes = $(this).attr('class');
                classes = classes.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    if (colRegexp.test(classes[i])) {
                        col = colRegexp.exec(classes[i])[1];
                    }
                    if (rowRegexp.test(classes[i])) {
                        row = rowRegexp.exec(classes[i])[1];
                    }
                }
                if (row !== false && col !== false) {
                    game.turnCard(row, col);
                }
            });
            $('#cheat').click(function() {game.generateFullMenu()});
        }();
        myGame = game;*/

    });
}(jQuery);