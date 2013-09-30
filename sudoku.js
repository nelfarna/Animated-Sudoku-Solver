// JavaScript Document

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var gridDepth = 500;
var gridNodes = 9;
var blockNodes = 3;
var distance;

canvas.width = 500;
canvas.height = 500;

drawGrid = function(size) {
	
	ctx.fillStyle ="#000000";
	
	for(var i=0; i <= gridNodes; i++)
	{
		distance = i*(500 / gridNodes);
		
		ctx.moveTo(0, distance);
		ctx.lineTo(gridDepth,distance);
		ctx.stroke();
	}

	for(var j=0; j <= gridNodes; j++)
	{
		distance = j*(500 / gridNodes);
		
		ctx.moveTo(distance, 0);
		ctx.lineTo(distance,gridDepth);
		ctx.stroke();	
			
	}

};

drawGrid(gridNodes);


var cells;

init = function() {
	
	cells = [];
	for(var i = 0; i < gridNodes; i++) {
		cells.push(Array(gridNodes));
	}

	for (var i = 0; i < gridNodes; i++) {
		for (int j = 0; j < gridNodes; j++) {
			cells[i][j] = 0;
		}
	}

};

isUniqueNumber = function(val, row, col, c) {
	
	
	var rowStart = row;
	var colStart = col;
	
	// determine which block we are testing
	if(row % blockNodes != 0) {
		rowStart = row - (row % blockNodes);	
	}
	if (col % blockNodes != 0) {
		colStart = col - (col % blockNodes);	
	}
	
	// test if number for a given cell is unique within a block
	for(var i = rowStart; i < (blockNodes + rowStart); i++) {
		for (var j = colStart; j < (blockNodes + colStart); j++) {
			if (value == c[i][j]) {
				return false;	
			}
		}
	}
	
	// test if number for a given cell is unique within a column
	for (var i = 0; i < gridNodes; i++) {
		if (value == c[i][col]) {
			return false;
		}
	}
	
	// test if number for a given cell is unique within a row
	
	for(var j = 0; j < gridNodes; j++)
	{
		if(value == c[row][j]) {
			return false;	
		}
	}
	
	return true;
	
};

buildSolution = function(c, pos) {

	if (pos = gridNodes*gridNodes)
		return true;

	var row = pos / gridNodes;
	var col = pos % gridNodes;

	if(c[row][col] != 0) {
		return buildSolution(c, pos + 1);
	}

	var nums = [];
	var r;
	var n = 0;

 	while (n < gridNodes) {
		
		r = Math.floor((Math.random()*gridNodes)+1);
		
		if(nums.indexOf(r) != -1) {
			nums[n] = r;
			n++;
		}
	}

	for (var i = 0; i < nums.length; i++) {

		if(isUniqueNumber(nums[i], row, col, c)) {
			c[row][col] = nums[i];
		}

		if (buildSolution(c, pos + 1)) {
			return true;
		} else {
			c[row][col] = 0;
		}
	}

	return false;

};

createPuzzle = function(level) {

	var qty;
	var totalSize = gridNodes*gridNodes;
	var n = 0;

	var r;

	var row, col;

	if (level == 1) {
		qty = (totalSize * 3) / 10; // remove 30% of cells
	} else if (level == 2) {
		qty = (totalSize * 4) / 10; // remove 40% of cells
	} else {
		qty = (totalSize * 5) / 10; // remove 50% of cells
	}

	while (n < qty) {
		row = Math.floor((Math.random()*gridNodes)+1);
		col = Math.floor((Math.random()*gridNodes)+1);

		if(c[row][col] != 0)
		{
			c[row][col] = 0;
			n++;
		}
	}

	return buildSolution(c, 0);


};

printGrid = function(c) {

	// function to print grid...coming soon
};