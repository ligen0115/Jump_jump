(function (w) {
    function Square(optional) {
        optional = optional || {};
        this.squareEle = null;
    }

    Square.prototype.render = function (left) {
        left = left || 500;
        return this.squareEle = $('<div class="square"><div class="top"><div class="ring"><div></div></div></div><div class="bottom"></div><div class="left"><div class="bar"></div></div><div class="right"><div class="bar"></div></div><div class="front"><div class="bar"></div></div><div class="after"><div class="bar"></div></div></div>').appendTo('#map').offset({ 'top': 700 - (left - $('#map')[0].offsetLeft) * 0.666, 'left': left })
    };

    Square.prototype.move = function (ele, left) {
        left = left || 500;
        $(ele).offset({ 'top': 700 - (left - $('#map')[0].offsetLeft) * 0.666, 'left': left })
    }
    w.Square = Square;
})(window);

(function (w) {
    function Unit(optional) {
        optional = optional || {};
        this.unitEle = null;
    }

    Unit.prototype.render = function (left) {
        left = left || 600;
        return this.unitEle = $('<div class="unit"><div class="top"></div><div class="bottom"></div><div class="right mian"><div class="bar"></div></div><div class="front mian"><div class="bar"></div></div><div class="after mian"><div class="bar"></div></div></div>').appendTo('#map').offset({ 'top': 740 - (left - $('#map')[0].offsetLeft) * 0.666, 'left': left })
    };

    Unit.prototype.move = function (left) {
        $(this.unitEle).css({ 'transition': 'all 1s' }).offset({ 'top': 740 - (left - $('#map')[0].offsetLeft) * 0.666, 'left': left })
    }
    w.Unit = Unit;
})(window);

(function (w) {
    function Game(optional) {
        optional = optional || {};
        this.square = new Square();
        this.unit = new Unit();
        this.keyDisable = false;
    }

    Game.prototype.begin = function () {
        this.square.render();
        this.square.render(800 + Math.random() * 300);
        this.unit.render();
        this.control();
        setTimeout(function () {
            $('#explanation').fadeOut(1000);
        }, 4000);
    };

    Game.prototype.control = function () {
        var unit = this.unit.unitEle;
        var charge = 0;

        $(document).on('keydown', function (e) {
            var code = e.keyCode || e.which || e.charCode;
            if (code == 32 && charge == 0) {
                e.preventDefault();
                if (this.keyDisable) {
                    return 0;
                }

                this.chargeTime = setInterval(function () {
                    if (charge <= 800) {
                        charge += 14;
                    }
                }, 15);

                $('.mian').css({ 'transition': 'all .9s linear', 'height': 50 });
                $('.unit .top').css({ 'transition': 'all .9s linear', 'transform': 'translateZ(50px)' });
            }

        }.bind(this)).on('keyup', function (e) {
            var code = e.keyCode || e.which || e.charCode;
            if (code == 32) {
                if (this.keyDisable) {
                    return 0;
                }

                this.keyDisable = true;
                charge = this.jump(unit, charge);
                clearInterval(this.chargeTime);
            }
        }.bind(this))
    };

    Game.prototype.jump = function (unit, charge) {
        var unit = this.unit.unitEle;
        $(unit).css({ 'transition': 'all 0s' });
        $('.mian').css({ 'transition': 'all .3s linear', 'height': 100 })
        $('.unit .top').css({ 'transition': 'all .3s linear', 'transform': 'translateZ(100px)' })

        var distance = charge;
        var left = parseInt($(unit).offset().left + distance);
        var top = Math.ceil(740 - ((left - $('#map')[0].offsetLeft) * 0.666));

        this.TimeX = setInterval(function () {
            var step = Math.ceil((left - $(unit).offset().left) / 28);
            $(unit).offset({ 'left': parseInt($(unit).offset().left + step )});
            console.log(parseInt($(unit).offset().left));
            console.log(left);
            if (parseInt($(unit).offset().left) == left) {
                clearInterval(this.TimeX)

                if ($(unit).position().left - 30 >= $(this.square.squareEle).position().left && $(unit).position().left - 40 <= $(this.square.squareEle).position().left + 140) {
                    $('#score').text(Number($('#score').text()) + 1)

                    setTimeout(function () {
                        var square0 = $('.square:eq(0)');
                        var square1 = $('.square:eq(1)');
                        this.square.move(square0, 500 - (square1.offset().left - square0.offset().left));
                        this.square.move(square1);
                        this.unit.move($(unit).offset().left - (square1.offset().left - square0.offset().left))
                        this.square.move(this.square.render(square1.offset().left + 800), Math.random() * 500 + 800);

                        setTimeout(function () {
                            square0.remove();
                            this.keyDisable = false;
                        }.bind(this), 500);

                    }.bind(this), 300);
                } else {
                    setTimeout(function () {
                        alert('游戏失败');
                        location.reload();
                    }, 200);
                }
            }
        }.bind(this), 5);

        this.TimeZ = setInterval(function () {
            var step = Math.floor((top - 300 - $(unit).offset().top) / 15);
            $(unit).offset({ 'top': Math.ceil($(unit).offset().top + step) });

            if (Math.abs((top - 300) - $(unit).offset().top) <= 20) {
                clearInterval(this.TimeZ)

                this.TimeZ2 = setInterval(function () {
                    var step = Math.ceil(($(unit).offset().top - (top - 300)) / 15);
                    $(unit).offset({ 'top': $(unit).offset().top + step });

                    if ($(unit).offset().top >= top) {
                        $(unit).offset({ 'top': top });
                        clearInterval(this.TimeZ2);
                    }
                }.bind(this), 5);
            }
        }.bind(this), 5);

        return 0;
    };
    w.Game = Game;
})(window);
(function (w) {
    $(function () {
        var game = new Game();
        game.begin();
    })
})(window);


