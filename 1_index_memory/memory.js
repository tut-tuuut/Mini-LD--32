var myGame = function($, undefined) {
    $(document).ready(function() {
        // Array of available links
        var plate; // protected in function. This array contains the solution…
        var score = 0; // no one cares about the score, but I protect it too.
        var returned = ['',''];
        var lastcells = [];
        var justfound = false;
        var found = [];
        var available = [
                'titi', 'tata', 'toto', 'maze', 'meaow'
            ];
        var names = {
            titi: 'A simple memory',
            tata: 'A chewing-gum and some hearts',
            toto: 'Arkabloid',
            maze: 'Amazing blob maze',
            meaow: 'Kitten‘s eye'
        };
        var links = {
            titi: 'index.html',
            tata: '2_simple_laby/index.html',
            toto: '3_arkabloid/index.html',
            maze: '4_true_laby/index.html',
            meaow: '5_kitty_generator/index.html'
        }
        // Public game object
        var game = {
            container : $('#theGame'),
            menuTop : $('#topMenu'),
            menuBottom : $('#botMenu'),
            getScore : function() {
                    return score;
                },
            turnCard : function (i, j) {
                if (plate[i,j] === 0) {
                    return;
                }
                var cell = $('.row-' + i + '.col-' + j);
                if (returned[0] === '') {
                    returned[0] = plate[i][j];
                    cell.addClass('turned').addClass(plate[i][j]);
                    lastcells.push(cell);
                } else if (returned[1] === '') {
                    returned[1] = plate[i][j];
                    cell.addClass('turned').addClass(plate[i][j]);
                    lastcells.push(cell);
                    if (returned[0] == returned[1]) {
                        lastcells = [];
                        this.addToMenu(returned[0]);
                    }
                } else {
                    for (var x = 0; x < lastcells.length; x++) {
                        lastcells[x].removeClass('turned')
                                    .removeClass(returned[0])
                                    .removeClass(returned[1]);
                    }
                    returned = ['',''];
                    lastcells = [];
                }
            },
            addToMenu : function(key) {
                var name = key, link = key, linkobj;
                if (available.indexOf(key) === -1) {
                    return;
                }
                if (names[key] !== undefined) {
                    name = names[key];
                }
                if (links[key] !== undefined) {
                    link = links[key];
                }
                linkobj = $('<a></a>');
                linkobj.attr('href', link).append(name);
                game.menuTop.append(linkobj);
                var secondobj = linkobj.clone();
                game.menuBottom.append(secondobj);
            },
            generateFullMenu : function() {
                this.menuTop.html('');
                this.menuBottom.html('');
                for (var i = 0; i < available.length; i++) {
                    this.addToMenu(available[i]);
                }
            }
        };
        // ----- Initialization stuff ------------------------------------------
        var getLinesAndCols = function(nbOfImages) {
            // This function generates the game array structure.
            var lc = {rows: 1, cols: 2, isDead: function() {return false;}};
            // "dead" cells are inactive: no action is available on them.
            switch (nbOfImages) {
                case 2:
                    lc.rows = 2;
                    lc.rows = 2;
                    break;
                case 3:
                    lc.rows = 2;
                    lc.cols = 3;
                    break;
                case 4:
                    lc.rows = 2;
                    lc.cols = 4;
                    break;
                case 5:
                    lc.rows = 3;
                    lc.cols = 4;
                    lc.isDead = function(i, j) {
                        // (2,2) and (2,3) are dead
                        return (i == 2) && ((j == 2) || (j == 3))
                    };
                    break;
                case 6:
                    lc.rows = 3;
                    lc.cols = 4;
                    break;
                case 7:
                    lc.rows = 4;
                    lc.cols = 4;
                    lc.isDead = function(i, j) {
                        // (2,2) and (2,3) are dead
                        return (i == 2 || i == 3) && (i == j);
                    };
                    break;
                case 8:
                    lc.rows = 4;
                    lc.cols = 4;
                    break;
            }
            return lc;
        }
        // Create tiles array
        var randInteger = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min); // Thanks @fetard :p
        };
        plate = function() {
            var i,j, buff, deadcells = 0;
            var plate = [];
            game.lc = getLinesAndCols(available.length);
            var lc = game.lc;
            var tiles = [];
            for (i = 0; i < available.length; i++) {
                tiles.push(available[i], available[i]);
            }
            // randomize array
            for (i = 0; i < tiles.length; i++) {
                j = randInteger(0, tiles.length - 1);
                // you can do it by using randInteger(i + 1, tiles.length - 1)
                // to save resources on big arrays.
                while (j == i) {
                    j = randInteger(0, tiles.length - 1);
                }
                buff = tiles[j];
                tiles[j] = tiles[i];
                tiles[i] = buff;
            }
            for (i = 0; i < lc.rows; i++) {
                plate[i] = [];
                for (j = 0; j < lc.cols; j++) {
                    if (lc.isDead(i+1, j+1)) {
                        plate[i][j] = false;
                        deadcells++;
                        continue;
                    }
                    plate[i][j] = tiles[i * lc.cols + j - deadcells];
                }
            }
            return plate;
        }();
        // Generate array of "visible" tiles whose dimensions depend on nb of links.
        var pouêt = function() {
            var lc = getLinesAndCols(available.length);
            var i,j, row, cell, table;
            table = $('<table></table>');
            for (i = 0; i < lc.rows; i++) {
                row = $('<tr></tr>');
                for (j = 0; j < lc.cols; j++) {
                    cell = $('<td></td>')
                            .addClass('row-' + i)
                            .addClass('col-' + j);
                    if (lc.isDead(i + 1, j + 1)) {
                        cell.addClass('dead').addClass('turned');
                    }
                    row.append(cell);
                }
                table.append(row);
            }
            game.container.append(table);
        }();
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
        myGame = game;

    });
}(jQuery);