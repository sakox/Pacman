(function () {
    'use strict';

    function Preloader() {
        this.asset = null;
        this.ready = false;
    }

    Preloader.prototype = {

        preload: function () {
            this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');

            this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
            this.load.setPreloadSprite(this.asset);

            this.loadResources();
        },

        loadResources: function () {
            this.load.image('dot', 'assets/dot.png');
            this.load.image('powerdot', 'assets/powerdot.png');
            this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.xml');
            this.load.tilemap('pacmanmap', 'assets/pacmanmap.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('pacmantile', 'assets/pacmantile.png');
            this.load.spritesheet('pacmansprite', 'assets/pacmansprite.png', 24, 24, 2);
            this.load.image('ghost0', 'assets/ghost0.png');
            this.load.image('ghost1', 'assets/ghost1.png');
            this.load.image('ghost2', 'assets/ghost2.png');
        },

        create: function () {
            this.asset.cropEnabled = false;

        },

        update: function () {
            if (!!this.ready) {
                this.game.state.start('menu');
            }
        },

        onLoadComplete: function () {
            this.ready = true;
        }
    };

    window['pacman'] = window['pacman'] || {};
    window['pacman'].Preloader = Preloader;

}());