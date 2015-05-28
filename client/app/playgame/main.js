var mainGame = (function () {
    'use strict';
    var game, ns = window['pacman'];

    return {
        startGame: function () {
            game = new Phaser.Game(600, 504, Phaser.AUTO, 'pacman-game');
            game.state.add('boot', ns.Boot);
            game.state.add('preloader', ns.Preloader);
            game.state.add('menu', ns.Menu);
            game.state.add('game', ns.Game);
            /* yo phaser:state new-state-files-put-here */

            game.state.start('boot');
        },
        endGame: function () {
            if(game){
                game.destroy();
            }
            
        }
    };
}());