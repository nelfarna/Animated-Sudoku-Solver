(function() {

	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		gridHeight = 500,
		s = new Sudoku(9), // pass in numbers 2, 4, or 9 (# cells in block)
		start, execTime;

	canvas.width = canvas.height = gridHeight;

	s.drawGrid(ctx, gridHeight); // draw grid on canvas

	s.initCells(); // initialize Sudoku grid, assign all cells to 0

	s.buildSolution(); // generate complete Sudoku solution

	s.createPuzzle(3); // create puzzle from solution, pass in level of difficulty (1, 2, or 3)

	s.printPuzzle(ctx, gridHeight); // print puzzle to canvas

    // get start and end time for solving puzzle using brute-force
	start = +new Date(); 

	s.solve();

	execTime = +new Date() - start; // execution time for solving puzzle

	console.log("Execution Time: " + execTime.toFixed(4) + " ms");

	s.printNodes(ctx, gridHeight); // now animate the program building the solution

})();
	