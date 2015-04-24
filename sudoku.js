(function (exports) {
	
	function Sudoku (length) {
		this.solutionCells = [];
		this.puzzleCells = [];
		this.gridLength = length || 9;
		this.blockLength = Math.floor(Math.sqrt(this.gridLength));
		this.nodesList = [];
	}

	exports.Sudoku = Sudoku;

	Sudoku.prototype.drawGrid = function(ctx, gridHeight) {
		
		var distance;

		ctx.fillStyle ="#000000";
		
		for(var i=0; i <= this.gridLength; i++)
		{
			distance = i*(gridHeight / this.gridLength);
			
			ctx.moveTo(0, distance);
			ctx.lineTo(gridHeight, distance);
			ctx.stroke();
		}

		for(var j=0; j <= this.gridLength; j++)
		{
			distance = j * (gridHeight / this.gridLength);
			
			ctx.moveTo(distance, 0);
			ctx.lineTo(distance, gridHeight);
			ctx.stroke();
		}

	};

	/* initCells returns a 9x9 array with elements all set to 0
	*/

	Sudoku.prototype.initCells = function() {
		var cells = [];
		for(var i = 0; i < this.gridLength; i++) {
			var arr = new Array(this.gridLength);
			for (var j = 0; j < this.gridLength; j++) {
				arr[j] = 0;
			}
			cells.push(arr);
		}

		this.solutionCells = cells;
	};

	Sudoku.prototype.isUniqueNumber = function(val, row, col) {
		
		var rowStart = row,
			colStart = col;
		
		// determine which block we are testing
		if(row % this.blockLength != 0) {
			rowStart = row - (row % this.blockLength);	
		}
		if (col % this.blockLength != 0) {
			colStart = col - (col % this.blockLength);	
		}
		
		// test if number for a given cell is unique within a block
		for(var i = rowStart; i < (this.blockLength + rowStart); i++) {
			for (var j = colStart; j < (this.blockLength + colStart); j++) {
				if (val == this.solutionCells[i][j]) {
					return false;	
				}
			}
		}
		
		// test if number for a given cell is unique within a column
		for (var i = 0; i < this.gridLength; i++) {
			if (val == this.solutionCells[i][col]) {
				return false;
			}
		}
		
		// test if number for a given cell is unique within a row
		for(var j = 0; j < this.gridLength; j++)
		{
			if(val == this.solutionCells[row][j]) {
				return false;	
			}
		}
		
		return true;
		
	};


	/* buildSolution builds a complete and random Sudoku solution that meets the rules of the game
	*/

	Sudoku.prototype.buildSolution = function(pos) {

		pos = pos || 0; // if pos not passed in, assume starting at pos=0
		if (pos == this.gridLength * this.gridLength) {
			return true;
		}

		var row = Math.floor(pos / this.gridLength);
		var col = pos % this.gridLength;

		if(this.solutionCells[row][col] != 0) {
			return this.buildSolution(pos + 1);
		}

		var gridnums = [];
		var randNum;
		var n = 0;

	 	while (n < this.gridLength) {
	 		randNum = Math.floor((Math.random() * this.gridLength) + 1);
	 		if(gridnums.indexOf(randNum) == -1) {
	 			gridnums.push(randNum);
	 			n++;
	 		}
		}

		for (var i = 0; i < gridnums.length; i++) {

			if(this.isUniqueNumber(gridnums[i], row, col)) {
				this.solutionCells[row][col] = gridnums[i];

				if (this.buildSolution(pos + 1)) {
					return true;
				} else {
					this.solutionCells[row][col] = 0;
				}
			}
		}

		return false;
	};


	/* This "solve" function is a little different than buildSolution in that it doesn't need to 
	   test numbers and it stores the recursion process in nodesList. Next step would be to combine
	   these two functions in some way since they are so similar.
	*/
	Sudoku.prototype.solve = function(pos) {
		
		pos = pos || 0;
		
		if (pos == this.gridLength * this.gridLength) {
			return true;
		}

		var row = Math.floor(pos / this.gridLength);
		var col = pos % this.gridLength;

		if(this.puzzleCells[row][col] != 0) { // if not 0 (empty), move on to next cell
			return this.solve(pos + 1);
		} 
		
		for (var n = 1; n <= this.gridLength; n++) {
			if(this.isUniqueNumber(n, row, col)) {
				this.puzzleCells[row][col] = n;
				
				this.nodesList.push({val: n, position: pos});
				
				if (this.solve(pos + 1)) {
					return true;
				} else {
					this.puzzleCells[row][col] = 0;
				}
			}
		}
	    
		return false;

	};

	/* createPuzzle takes the completed Sudoku solution and randomly removes cells. The
		number of cells removed depends on the difficulty level 
	*/

	Sudoku.prototype.createPuzzle = function(level) {

		var totalSize = this.gridLength * this.gridLength,
			n = 0,
			qty, row, col,
			c = this.solutionCells;

		level = level || 3;

		if (level == 1) {
			qty = Math.floor((totalSize * 4) / 10); // remove 30% of cells
		} else if (level == 2) {
			qty = Math.floor((totalSize * 5) / 10); // remove 40% of cells
		} else {
			qty = Math.floor((totalSize * 6) / 10); // remove 50% of cells
		}

		while (n < qty) {
			row = Math.floor(Math.random() * this.gridLength);
			col = Math.floor(Math.random() * this.gridLength);
			
			if(c[row][col] != 0) {
				c[row][col] = 0;
				n++;
			}
		}

		this.puzzleCells = c;
	};

	Sudoku.prototype.printPuzzle = function(ctx, gridHeight) {

		var gridWidth = gridHeight / this.gridLength,
			fontSize =  gridWidth / 2,
			fontX = gridWidth / 3, // center text as best as possible, depends on total grid height
			fontY = gridWidth * 3 / 4;

		ctx.font = fontSize + "px Arial";

		for (var i = 0; i < this.gridLength; i++) {
			for (var j = 0; j < this.gridLength; j++ ) {
	 
				if(this.puzzleCells[i][j] != 0) {
					ctx.fillText(this.puzzleCells[i][j], j * gridWidth + fontX, i * gridWidth + fontY);
				} 
			}
		}

	};

	Sudoku.prototype.pauseToPrint = function(val, x, y, gridHeight, ctx) {
		
		var gridWidth = gridHeight / this.gridLength,
			fontSize =  gridWidth / 2,
			fontX = gridWidth / 3, // center text as best as possible, depends on total grid height
			fontY = gridWidth*3 / 4;

		ctx.font = fontSize + "px Arial";
				
		var alpha = 0.0,
			interval = setInterval (function () {
				ctx.fillStyle = "#ffffff";
				ctx.fillRect(x * gridWidth + 4, y * gridWidth + 4, gridWidth - 10, gridWidth - 10);
			
				ctx.fillStyle = "rgba(255, 0, 0, " + alpha + ")";
				ctx.fillText(val, x * gridWidth + fontX, y * gridWidth + fontY);

				alpha = alpha + 0.05;
				if(alpha > 1) {
					clearInterval(interval);
				}

			}, 20);

	};

	Sudoku.prototype.printNodes = function(ctx, gridHeight) {
		var size = this.nodesList.length,
			row, col, val,
		    that = this;

		for (var i = 0; i < size; i++) {
			(function (i) {
				setTimeout(function () {
					that.pauseToPrint(
						that.nodesList[i].val, 
						that.nodesList[i].position % that.gridLength, 
						Math.floor(that.nodesList[i].position / that.gridLength), 
						gridHeight, 
						ctx
					);
				}, i * 200);
			})(i);
		}
	};
	
}) (typeof exports == 'undefined' ? this : exports);

