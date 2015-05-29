(function () {
    'use strict';
    //initier variabler til spillet
    function Game() {
        this.map = null;
        this.layer = null;
        this.layer2 = null;
        this.pacman = null;
        this.ghosts = [];
        this.dots = null;
        this.powerdots = null;
        this.text = null;
        this.gameheight = 21;
        this.gamewidth = 25;
        this.speed = 150;
        this.threshold = 3;
        this.gridsize = 24;
        this.score = 0;
        this.ghostKilled = 0;
        this.powerful = false;
        this.gameText = null;

        this.marker = new Phaser.Point();
        this.turnPoint = new Phaser.Point();

        this.directions = [null, null, null, null, null];
        this.opposites = [Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP];

        this.current = Phaser.NONE;
        this.turning = Phaser.NONE;
    }

    Game.prototype = {
        //laver og tilføjer elementer til spillet
        create: function () {

            this.map = this.add.tilemap('pacmanmap');
            this.map.addTilesetImage('pacmantile', 'pacmantile');
            this.layer = this.map.createLayer('Tile Layer 1');
            this.layer.resizeWorld();

            this.addPacman();
            this.map.setCollisionByExclusion([10, 15], true);
            this.map.setTileIndexCallback([3, 4], this.teleport, this);


            this.cursors = this.input.keyboard.createCursorKeys();
            var spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.togglePause, this);

            this.addObjects();
            this.time.events.add(Phaser.Timer.SECOND * 8, this.startGhosts, this);

            this.text = this.add.text(this.camera.x, this.camera.y, 'Score: ' + this.score, {
                font: '24px Arial',
                fill: 'ff0044',
                align: 'center'
            });




        },
        //tilføjer pacman og starter animation + bevægelse
        addPacman: function () {
            this.pacman = this.add.sprite((12 * this.gridsize) + 12, (11 * this.gridsize) + 12, 'pacmansprite', 0);
            this.pacman.anchor.set(0.5);
            this.physics.arcade.enable(this.pacman);
            this.pacman.animations.add('walk');
            this.pacman.animations.play('walk', 7, true);
            this.move(Phaser.LEFT);
        },
        //tilføjer dots, powerdots og ghosts til de respektive pladser på banen
        addObjects: function () {
            this.dots = this.add.group();
            this.dots.enableBody = true;
            this.dots.physicsBodyType = Phaser.Physics.ARCADE;
            this.powerdots = this.add.group();
            this.powerdots.enableBody = true;
            this.powerdots.physicsBodyType = Phaser.Physics.ARCADE;
            this.ghosts = this.add.group();
            this.ghosts.enableBody = true;
            this.ghosts.physicsBodyType = Phaser.Physics.ARCADE;
            for (var i = 0; i < this.gameheight; i++) {
                for (var j = 0; j < this.gamewidth; j++) {
                    var currentTile = this.map.getTile(j, i, 'Tile Layer 1').index;

                    if (currentTile === 15) {

                        var a = this.dots.create((j * this.gridsize) + 10, (i * this.gridsize) + 10, 'dot');
                        a.name = j + 'dot' + i;
                    } else if (currentTile === 10) {
                        var b = this.powerdots.create((j * this.gridsize) + 8, (i * this.gridsize) + 8, 'powerdot');
                        b.name = j + 'powerdot' + i;
                    } else if (currentTile === 1 && this.ghosts.total !== 3) {
                        var c = this.ghosts.create((j * this.gridsize) + 12, (i * this.gridsize) + 12, 'ghost' + this.ghosts.total);
                        c.name = 'ghost' + this.ghosts.total;
                        c.anchor.setTo(0.5, 0.5);
                    }
                }
            }


        },
        //pause funktion
        togglePause: function () {
            this.physics.arcade.isPaused = (this.physics.arcade.isPaused) ? false : true;
        },
        //hvis pacman rammer en teleport teleporteres den til modsatte teleport
        teleport: function () {
            if (this.current === Phaser.RIGHT) {
                this.pacman.x = 62;
            } else {
                this.pacman.x = 544;
            }
        },
        //opdaterer scoretext hvergang denne kaldes
        updateScore: function () {
            this.text.setText('Score: ' + this.score);
        },
        //tjekker hvilke knapper (højre,venstre,op,ned) der trykkes
        checkKeys: function () {

            if (this.cursors.left.isDown && this.current !== Phaser.LEFT) {
                this.checkDirection(Phaser.LEFT);
            } else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT) {
                this.checkDirection(Phaser.RIGHT);
            } else if (this.cursors.up.isDown && this.current !== Phaser.UP) {
                this.checkDirection(Phaser.UP);
            } else if (this.cursors.down.isDown && this.current !== Phaser.DOWN) {
                this.checkDirection(Phaser.DOWN);
            } else {
                //  This forces them to hold the key down to turn the corner
                this.turning = Phaser.NONE;
            }

        },
        //smider ghosts ud af fængslet hvis de er der
        startGhosts: function () {
            this.ghosts.forEach(function (item) {
                if (this.rnd.integerInRange(0, 1) === 0 && item.x > 230 && item.x < 360 && item.y === 228) {
                    item.y += 48;
                } else if (item.x > 230 && item.x < 360 && item.y === 228) {
                    item.y -= 48;
                }
            }, this);
        },
        //tjekker om den vej man vil gå er låst
        checkDirection: function (turnTo) {

            if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== 15 && this.directions[turnTo].index !== 10) {
                //  Invalid direction if they're already set to turn that way
                //  Or there is no tile there, or the tile isn't index 1 (a floor tile)
                return;
            }

            //  Check if they want to turn around and can
            if (this.current === this.opposites[turnTo]) {
                this.move(turnTo);
            } else {
                this.turning = turnTo;
                this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
                this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
            }

        },
        //tjekker om pacman er helt inde på et felt før det drejer
        turn: function () {

            var cx = Math.floor(this.pacman.x);
            var cy = Math.floor(this.pacman.y);

            //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
            if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold)) {
                return false;
            }

            //  Grid align before turning
            this.pacman.x = this.turnPoint.x;
            this.pacman.y = this.turnPoint.y;

            this.pacman.body.reset(this.turnPoint.x, this.turnPoint.y);

            this.move(this.turning);

            this.turning = Phaser.NONE;

            return true;

        },
        //bevægelses funktion
        move: function (direction) {

            var speed = this.speed;

            if (direction === Phaser.LEFT || direction === Phaser.UP) {
                speed = -speed;
            }

            if (direction === Phaser.LEFT || direction === Phaser.RIGHT) {
                this.pacman.body.velocity.x = speed;
            } else {
                this.pacman.body.velocity.y = speed;
            }

            //  Reset the scale and angle (Pacman is facing to the right in the sprite sheet)
            this.pacman.scale.x = 1;
            this.pacman.angle = 0;

            if (direction === Phaser.LEFT) {
                this.pacman.scale.x = -1;
            } else if (direction === Phaser.UP) {
                this.pacman.angle = 270;
            } else if (direction === Phaser.DOWN) {
                this.pacman.angle = 90;
            }

            this.current = direction;

        },
        //funktion der kører for hver frame, fx tjek af kollisioner og tjek af felter til pacman
        update: function () {
            this.physics.arcade.collide(this.pacman, this.layer);
            this.physics.arcade.overlap(this.pacman, this.dots, this.eatDot, null, this);
            this.physics.arcade.overlap(this.pacman, this.powerdots, this.eatPowerDot, null, this);
            this.physics.arcade.overlap(this.pacman, this.ghosts, this.hitGhost, null, this);

            this.marker.x = this.math.snapToFloor(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
            this.marker.y = this.math.snapToFloor(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;


            //  Update our grid sensors
            this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
            this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
            this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
            this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);


            this.checkKeys();

            if (this.turning !== Phaser.NONE) {
                this.turn();
            }

        },
        //kollision mellem pacman og ghost
        hitGhost: function (pacman, ghosts) {

            if (this.powerful) {
                ghosts.kill();
                this.score += 200 * this.ghostKilled;
                this.ghostKilled++;
                this.updateScore();
                ghosts.reset(12 * this.gridsize + 12, 9 * this.gridsize + 12);
                ghosts.revive();
                this.time.events.add(Phaser.Timer.SECOND * 2, this.startGhosts, this);
            } else {
                pacman.kill();
                this.gameOver();
            }

        },

        //kollision mellem pacman og normal dot
        eatDot: function (pacman, dot) {

            dot.kill();
            this.score += 10;
            this.updateScore();

            if (this.dots.total === 0 && this.powerdots.total === 0) {
                this.dots.callAll('revive');
                this.powerdots.callAll('revive');
            }

        },
        //kollision mellem pacman og powerdot, gør pacman stærk
        eatPowerDot: function (pacman, powerdot) {

            powerdot.kill();
            this.score += 50;
            this.updateScore();
            this.powerful = true;
            this.ghosts.setAll('alpha', 0.5);
            this.time.events.add(Phaser.Timer.SECOND * 8, this.makeNormal, this);

            if (this.dots.total === 0 && this.powerdots.total === 0) {
                this.dots.callAll('revive');
                this.powerdots.callAll('revive');
            }

        },
        //gør pacman svag igen
        makeNormal: function () {
            this.powerful = false;
            this.ghosts.setAll('alpha', 1);
            this.ghostKilled = 1;
        },
        //Skriver game over og sender scoren til feltet for highscores under spillet
        gameOver: function () {
            this.gameText = this.add.text(this.world.centerX, this.world.centerY, '- Game Over! -', {
                font: "60px Arial",
                fill: "#ffffff",
                align: "center"
            });
            this.gameText.anchor.setTo(0.5, 0.5);
            var score = document.getElementById('scoreText').value = this.score;


        }

    };

    window['pacman'] = window['pacman'] || {};
    window['pacman'].Game = Game;

}());