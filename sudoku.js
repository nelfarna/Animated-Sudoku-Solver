(function (exports) {
	
	var LinkedList;
	if(typeof module !== 'undefined' && module.exports) {
		LinkedList = require("./linkedlist").LinkedList;
	} else {
		LinkedList = this.LinkedList;
	}

	function Sudoku (length) {
		this.cells = [];
		this.puzzleCells = [];
		this.gridLength = length;
		this.blockLength = Math.floor(Math.sqrt(length));

		this.nodesList = new LinkedList(); // generic linked list to store backtracking process
	}

	exports.Sudoku = Sudoku;

	Sudoku.prototype.drawGrid = function(gridHeight, ctx) {
		
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

		

		this.cells = cells;


	};

	Sudoku.prototype.isUniqueNumber = function(val, row, col) {
		
		var rowStart = row;
		var colStart = col;
		
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
				if (val == this.cells[i][j]) {
					return false;	
				}
			}
		}
		
		// test if number for a given cell is unique within a column
		for (var i = 0; i < this.gridLength; i++) {
			if (val == this.cells[i][col]) {
				return false;
			}
		}
		
		// test if number for a given cell is unique within a row
		
		for(var j = 0; j < this.gridLength; j++)
		{
			if(val == this.cells[row][j]) {
				return false;	
			}
		}
		
		return true;
		
	};


	/* buildSolution builds a complete and random Sudoku solution that meets the rules of the game
	*/

	Sudoku.prototype.buildSolution = function(c, pos) {

		if (pos == this.gridLength * this.gridLength) {
			return true;
		}

		var row = Math.floor(pos / this.gridLength);
		var col = pos % this.gridLength;

		if(c[row][col] != 0) {
			
			return this.buildSolution(c, pos + 1);
		}

		var nums = [];
		var r;
		var n = 0;
		var found;

	 	while (n < this.gridLength) {
			found = false;
			r = Math.floor((Math.random() * this.gridLength) + 1);
			
			for(var i = 0; i < nums.length; i++) {
				if(nums[i] === r) {
					
					found = true;
					break;
				}
			}

			if (!found)  {
				nums.push(r);
				
				n++;
				
			}
		}

		for (var i = 0; i < nums.length; i++) {

			if(this.isUniqueNumber(nums[i], row, col)) {
				c[row][col] = nums[i];


				if (this.buildSolution(c, pos + 1)) {

					return true;
				} else {
					c[row][col] = 0;
				}
			}
		}

		return false;

	};




	/* This "solve" function is a little different than buildSolution in that it doesn't need to 
	   test numbers and it stores the recursion process in nodesList. Next step would be to combine
	   these two functions in some way since they are so similar.
	*/
	Sudoku.prototype.solve = function(c, pos) {

		if (pos == this.gridLength * this.gridLength) {
			return true;
		}

		var row = Math.floor(pos / this.gridLength);
		var col = pos % this.gridLength;

		if(c[row][col] != 0) {
			return this.solve(c, pos + 1);
		} 

		var nums = [];
		var r;
		var n = 0;
		var found;
		var success;

		
		for (var n = 1; n <= this.gridLength; n++) {
			
			if(this.isUniqueNumber(n, row, col)) {
				c[row][col] = n;
			    
				
				this.nodesList.add(n, pos);
				
				if (this.solve(c, pos + 1)) {
					return true;
				} else {
					c[row][col] = 0;
				}
			}

		}
	    
		return false;

	};

	/* createPuzzle takes the completed Sudoku solution and randomly removes cells. The
		number of cells removed depends on the difficulty level 
	*/

	Sudoku.prototype.createPuzzle = function(level) {

		var qty;
		var totalSize = this.gridLength * this.gridLength;
		var n = 0;

		var r;

		var row, col;

		var c = this.cells;

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

		ctx.font="30px Arial";
		
		for (var i = 0; i < this.gridLength; i++) {
			for (var j = 0; j < this.gridLength; j++ ) {
	 
				if(this.puzzleCells[i][j] != 0) {
					ctx.fillText(this.puzzleCells[i][j], j * (gridHeight / this.gridLength)+20, i * (gridHeight / this.gridLength) + 40);
				} 
			}
		}

	};

	Sudoku.prototype.pauseToPrint = function(node, x, y, gridHeight, ctx) {
		
		ctx.font="30px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(x * (gridHeight / this.gridLength) + 10,y * (gridHeight / this.gridLength) + 10, 35, 35);
				
		var alpha = 0.0;
		var that = this;
		var gridLength = this.gridLength;
		var interval = setInterval (function () {
			
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(x * (gridHeight / gridLength) + 10, y * (gridHeight / gridLength) + 10, 35, 35);
		
			ctx.fillStyle = "rgba(255, 0, 0, " + alpha + ")";
			ctx.fillText(node.val, x * (gridHeight / gridLength) + 20, y * (gridHeight / gridLength) + 40);

			alpha = alpha + 0.05;
			if(alpha > 1) {
				clearInterval(interval);
			}

		}, 20);

	};


	Sudoku.prototype.printNodes = function(node, pos, gridHeight, ctx) {

	    var row; 
		var col; 
		var currentNode = node;
		var size = this.nodesList.getSize();
		var val;
		var isDone;

		
		if(pos > size) return false;
		
		if (pos < size) {
		
	            	row = Math.floor(currentNode.position / this.gridLength);
					col = currentNode.position % this.gridLength;
					val = currentNode.val;
				
					this.pauseToPrint(currentNode, col, row, gridHeight, ctx);
					
					currentNode = currentNode.next;

					var that = this;
					
					setTimeout(function () {
							
								isDone = that.printNodes(currentNode, pos + 1, gridHeight, ctx);
							
						}, 200);
	        	    return isDone;
				
		} else {
			return false;
		}
	};



	
}) (typeof exports == 'undefined' ? this : exports);

