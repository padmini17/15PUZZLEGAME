(function(){  //global function 
	
	var state = 1;  //The puzzle is in solved state
	var puzzle = document.getElementById('puzzle');

	// Shows already solved puzzle
	solve();
	
	// Listens for click on puzzle cells
	puzzle.addEventListener('click', function(e){
		if(state == 1){
			// Enables sliding animation when we press rearrange button
			puzzle.className = 'animate';
			shiftCell(e.target);
		}
	});
	
	// Listens for click on control buttons i.e to solve and rearrange
	document.getElementById('solve').addEventListener('click', solve);
	document.getElementById('rearrange').addEventListener('click', rearrange);

//To create a layout for the puzzle in which it has to appear
	function solve(){
		
		if(state == 0){    //If the puzzle is not solved then return 
			return;
		}
		
		puzzle.innerHTML = '';     //firstly empty string
		
		var n = 1;
		for(var i = 0; i <= 3; i++){
			for(var j = 0; j <= 3; j++){
				var cell = document.createElement('span');    //creating an element span
				cell.id = 'cell-'+i+'-'+j;
				cell.style.left = (j*80+1*j+1)+'px';    //vertical left arrangement of the elements
				cell.style.top = (i*80+1*i+1)+'px';     //horizontal top arrangement of the elements 
				
				if(n <= 15){
					cell.classList.add('number');      //To add the number in the button space
					cell.classList.add((i%2==0 && j%2>0 || i%2>0 && j%2==0) ? 'dark' : 'light');  //If the number is even then it is dark shade else it is light in colour
					cell.innerHTML = (n++).toString();    //Convert the numbers to string
				} else {
					cell.className = 'empty';      //elese produce an empty cell
				}
				
				puzzle.appendChild(cell);         //We need to append this structure inside the puzzle border
			}
		}
		
	}
//To shift the already numbered cell to the empty cell
	function shiftCell(cell){
		
		// Checks if selected cell has number or not
		if(cell.clasName != 'empty'){
			
			// Tries to get empty adjacent cell beside the selected cell
			var emptyCell = getEmptyAdjacentCell(cell);
			
			if(emptyCell) //if there is empty cell then
			{
				// Temporary data needs to be stored
				var tmp = {style: cell.style.cssText, id: cell.id};
				
				// To exchange the id and style values
				cell.style.cssText = emptyCell.style.cssText;
				cell.id = emptyCell.id;
				emptyCell.style.cssText = tmp.style;
				emptyCell.id = tmp.id;
				
				if(state == 1){     //if the puzzle is already solved then check the order of the numbers
 
					setTimeout(checkOrder, 150);
				}
			}
		}
		
	}
//Getting the specific cell by its corresponding row and column numbers
	function getCell(row, col){
	
		return document.getElementById('cell-'+row+'-'+col);
		
	}

	//To get the cell which is empty by query selector is empty
	function getEmptyCell(){
	
		return puzzle.querySelector('.empty');
			
	}
	
	//if there is an adjacent cell then obtain it
	function getEmptyAdjacentCell(cell){
		
		// Gets all adjacent cells by variable adjacent
		var adjacent = getAdjacentCells(cell);
		
		// Searches for empty cell in these adjacent cells choosen
		for(var i = 0; i < adjacent.length; i++){
			if(adjacent[i].className == 'empty'){
				return adjacent[i];
			}
		}
		
		// if adjacent cell which is not empty then return false
		return false;
		
	}

	 //To get all the adjacent cells
	function getAdjacentCells(cell){
		
		var id = cell.id.split('-');  //To split the adjacent cells between the the cells
		
		// Gets cell position indexes according to the row and column
		var row = parseInt(id[1]);
		var col = parseInt(id[2]);
		
		var adjacent = [];   //let the adjacent cell be empty
		
		// Gets all possible adjacent cells by the conditions of the rows and columns
		if(row < 3){adjacent.push(getCell(row+1, col));}			
		if(row > 0){adjacent.push(getCell(row-1, col));}
		if(col < 3){adjacent.push(getCell(row, col+1));}
		if(col > 0){adjacent.push(getCell(row, col-1));}
		
		return adjacent;   //return the adjacent cell
		
	}
	
		//checks if the number order is correct or not
		function checkOrder(){
		
		// Checks if the empty cell is in correct position at the starting state
		if(getCell(3, 3).className != 'empty'){
			return;
		}
	
		var n = 1;
		// Goes through all cells and checks numbers
		for(var i = 0; i <= 3; i++){
			for(var j = 0; j <= 3; j++){
				if(n <= 15 && getCell(i, j).innerHTML != n.toString()){
					// If the Order is not correct then just return
					return;
				}
				n++;   //We will increment and just check the order of the numbers again
			}
		}
		
		// If the puzzle is solved, then we need to rearrange again
		if(confirm('Congrats, You did it! \nShall we rearrange the puzzle for you to solve again\nIf so, Best of luck!!!')){
			rearrange();  //to rearrange the puzzle
		}
	
	}

	//Function to rearrange the puzzle all the grids
	function rearrange(){
	
		if(state == 0){     //if not solved then just return
			return;
		}
		
		puzzle.removeAttribute('class');
		state = 0;
		
		var previousCell;
		var i = 1;
		var interval = setInterval(function(){
			if(i <= 100){
				var adjacent = getAdjacentCells(getEmptyCell());
				if(previousCell){
					for(var j = adjacent.length-1; j >= 0; j--){
						if(adjacent[j].innerHTML == previousCell.innerHTML){
							adjacent.splice(j, 1);   //adds or removes the array elements
						}
					}
				}
				// To get random adjacent cell and memorizes it for the next iteration
				previousCell = adjacent[rand(0, adjacent.length-1)];  //to get a random number that is greater than or equal to 0 and less than 1
				shiftCell(previousCell);
				i++;
			} else {
				clearInterval(interval);
				state = 1;
			}
		}, 5);

	}
	
//To generate a random number to randomly arrange the grids.
	function rand(from, to){

		return Math.floor(Math.random() * (to - from + 1)) + from;

	}

}());
