execute = function() {

		var canvas = document.getElementById('canvas');
		var ctx = canvas.getContext('2d');
		var gridHeight = 500;

		canvas.width = canvasDLX.width = gridHeight;
		canvas.height = canvasDLX.height = gridHeight;

		var s = new Sudoku(9); // choose numbers 2, 4, 9
		s.drawGrid(gridHeight, ctx); // draw grid on canvas

		s.initCells(); // initialize Sudoku grid, assign all cells to 0

		s.buildSolution(s.cells, 0); // generate complete Sudoku solution

		s.createPuzzle(3, s.cells); // create puzzle from solution

		s.printPuzzle(ctx, gridHeight); // print puzzle to canvas

		var start = new Date().getTime(); // get start and end time for solving puzzle using brute-force
		s.solve(s.puzzleCells, 0);
		var end = new Date().getTime();
		var time = end - start; // execution time for solving puzzle
		console.log("Execution Time: " + time + " ms");

		s.printNodes(s.nodesList.first, 0, gridHeight, ctx);

	};

	execute();
	