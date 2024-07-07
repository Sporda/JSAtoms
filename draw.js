var Draw = {
    POSITIONS: [
        null,
        [[1/2, 1/2]],
        [[1/4, 1/4], [3/4, 3/4]],
        [[1/2, 1/2], [1/4, 1/4], [3/4, 3/4]],
        [[1/4, 1/4], [3/4, 3/4], [1/4, 3/4], [3/4, 1/4]],
        [[1/2, 1/2], [1/4, 1/4], [3/4, 3/4], [1/4, 3/4], [3/4, 1/4]],
        [[1/4, 1/4], [3/4, 3/4], [1/4, 3/4], [3/4, 1/4], [1/2, 1/4], [1/2, 3/4]],
        [[1/2, 1/2], [1/4, 1/4], [3/4, 3/4], [1/4, 3/4], [3/4, 1/4], [1/2, 1/4], [1/2, 3/4]],
        [[1/4, 1/4], [3/4, 3/4], [1/4, 3/4], [3/4, 1/4], [1/2, 1/4], [1/2, 3/4], [1/4, 1/2], [3/4, 1/2]],
    ],
    CELL:  60,
    LINE: 2,
    ATOM: 7,
    _context: null
};
/* Vyroba canvasu a jeho priprava */
Draw.init = function() {
    
    var canvas = document.createElement("canvas");

    this.CELL += this.LINE;

    var size = Game.SIZE * this.CELL + this.LINE;
    canvas.width = size;
    canvas.height = size;

    this._context = canvas.getContext("2d");
    this._context.lineWidth = this.LINE;
    this._context.fillStyle = "#000";
    this._context.fillRect(0, 0, size, size);

    for (var i = 0; i < Game.SIZE; i++) {
        for (var j = 0; j < Game.SIZE; j++) {
            this._cell(i, j);
        }
    }
    document.body.appendChild(canvas);
};
/* Vykresleni cele hraci plochy */
Draw.all = function() {
    this._context.fillStyle = "#fff";
    var width = this._context.canvas.width;
    var height = this._context.canvas.height;

    this._context.fillRect(0, 0 , width, height);

    this._lines();
    this._cells();
}

Draw.cell = function(x, y) {
    /* Vymazani bunky */
    var size = this.CELL - this.LINE;
    var left = x * this.CELL + this.LINE;
    var top = y * this.CELL + this.LINE;
    this._context.fillStyle = "#fff";
    this._context.fillRect(left, top, size, size);
    
    var count = Board.getAtoms(x, y);
    if (!count) return;

    var player = Board.getPlayer(x, y);
    var color = Score.getColor(player);

    var positions = this.POSITIONS[count];

    for (var i=0; i < positions.length; i++) {
        var position = positions[i];
        var posX = position[0];
        var posY = position[1];
        var atomX = (x + posX) * this.CELL;
        var atomY = (y + posY) * this.CELL;

        this._atom(atomX, atomY, color);
    }
}

/* Vykreslit mrizku */
Draw._lines = function() {
    this._context.beginPath();

    for (var i = 0; i < Game.SIZE + 1; i++) {
        var x = this.LINE/2 + i * this.CELL;
        this._context.moveTo(x, this.LINE/2);
        this._context.lineTo(x, this._context.canvas.height);
    }

    for (var i = 0; i < Game.SIZE + 1; i++) {
        var y = this.LINE/2 + i * this.CELL;
        this._context.moveTo(0, y);
        this._context.lineTo(this._context.canvas.width, y);
    }

    this._context.stroke();
}
Draw._cells = function() {
    for (var i = 0; i < Game.SIZE; i++) {
        for (var j = 0; j < Game.SIZE; j++) {
            this._cell(i, j, Board.getAtoms(i, j));
        }
    }
}

Draw._cell = function(x, y, count) {
    var positions = this.POSITIONS[count];
    if (!positions) return;

    for (var i = 0; i < positions.length; i++) {
        var position = positions[i];
        var posX = position[0];
        var posY = position[1];
        var atomX = (x + posX) * this.CELL;
        var atomY = (y + posY) * this.CELL;

        this._atom(atomX, atomY);
    }
}

/* Vykreslit jeden atom */
Draw._atom = function(x, y, color) {
    this._context.beginPath();

    this._context.moveTo(x + this.ATOM, y);
    this._context.arc(x, y, this.ATOM, 0, 2 * Math.PI, false);

    this._context.fillStyle = color;
    this._context.fill();
    this._context.stroke();
}

/* Prevod pozice kurzoru na souradnice bunky */

Draw.getPosition = function(cursorX, cursorY) {
    var rectangle = this._context.canvas.getBoundingClientRect();

    cursorX -= rectangle.left;
    cursorY -= rectangle.top;

    if (cursorX < 0 || cursorX > rectangle.width) { return null; }
    if (cursorY < 0 || cursorY > rectangle.height) { return null; }

    var cellX = Math.floor(cursorX / this.CELL);
    var cellY = Math.floor(cursorY / this.CELL);
    return [cellX, cellY];
}