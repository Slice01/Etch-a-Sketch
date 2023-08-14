const restartButton = document.querySelector('#createButton');
const drawButton = document.querySelector('#drawButton');
const border = document.querySelector('#border');
const footButtons = document.querySelectorAll('.foot');
let mode = 'Normal';
let drawActive;
let rowCount = 16;

//Setting for shaded drawing
function drawShaded() {
	let currentShade = this.style.backgroundColor;
	
	if (currentShade.slice(5,12) !== '0, 0, 0' && currentShade.slice(4,11) !== '0, 0, 0') {
		currentShade = 'rgba(0, 0, 0, 0.1)';
	};
	
	let shadeCut = parseFloat(currentShade.slice(currentShade.length - 3, currentShade.length - 1));
	let newShade = currentShade.replace(shadeCut, shadeCut + .1);
	this.style.backgroundColor = newShade;
}

//Setting for colored drawing
function drawColored() {
	let randomRed = Math.floor(Math.random() * 256);
	let randomGreen = Math.floor(Math.random() * 256);
	let randomBlue = Math.floor(Math.random() * 256);
	this.style.backgroundColor = 'rgba(' + randomRed + ',' + randomGreen + ',' + randomBlue + ',.5)';
}

//Setting for blue drawing
function drawNormal() {
	this.style.backgroundColor = 'blue';
};

//Makes drawing inactive
function notReadyToDraw() {
	drawActive = 'Off';
	drawButton.removeEventListener('click', notReadyToDraw);
	drawButton.addEventListener('click', readyToDraw);
	drawButton.classList.remove('selected');
	
	const onBox = document.querySelectorAll('.box');
	onBox.forEach(box => box.removeEventListener('mouseover', drawNormal));
	onBox.forEach(box => box.removeEventListener('mouseover', drawColored));
	onBox.forEach(box => box.removeEventListener('mouseover', drawShaded));
}

//Makes drawing active
function readyToDraw() {
	drawActive = 'On';
	drawButton.removeEventListener('click', readyToDraw);
	drawButton.addEventListener('click', notReadyToDraw);
	drawButton.classList.add('selected');

	const onBox = document.querySelectorAll('.box');
	if (mode == 'Normal'){
		onBox.forEach(box => box.addEventListener('mouseover', drawNormal));
	} else if (mode == 'Colored'){
		onBox.forEach(box => box.addEventListener('mouseover', drawColored));
	} else {
		onBox.forEach(box => box.addEventListener('mouseover', drawShaded));
	}
}

function buildGrid() {
	border.classList.remove('hidden');
	
	for (let i = 0; i < rowCount; i++) {
		const newRow = document.createElement('div');
		newRow.setAttribute('class', 'row delRow');
		border.appendChild(newRow);
	
		for (let i = 0; i < rowCount; i++) {
			const newBox = document.createElement('div');
			newBox.setAttribute('class', 'box');
			newRow.appendChild(newBox);
		};
	};
};	

//New pad construction
function updateRowCount() {
	rowCount = document.getElementById('submitField').value;
		
	if (rowCount > 100 || rowCount < 1) {
		alert('Please keep the number of squares per side between 1 and 100')
			
	} else {
		const delForm = document.querySelector('.overlay');
		delForm.remove();
		buildGrid();
	}
};

function clearGrid() {
	const onRow = document.querySelectorAll('.delRow');
	onRow.forEach(row => row.remove());
	border.classList.add('hidden');
};

function promptForGrid() {  //Creates the prompt for grid size
	const formSpace = document.getElementById('formSpace');
	const newForm = document.createElement('div');
	newForm.classList.add('overlay');
	formSpace.appendChild(newForm);
	
	const newPara = document.createElement('p');
	newPara.textContent = 'How many squares per side would you like to play on? (max: 100)'
	newForm.appendChild(newPara);
	
	const newDiv = document.createElement('div');
	newDiv.setAttribute('class', 'row control');
	newForm.appendChild(newDiv);
	
	const newInput = document.createElement('input');
	newInput.setAttribute('placeholder', '16');
	newInput.setAttribute('id' , 'submitField');
	newInput.setAttribute('type', 'number');
	newDiv.appendChild(newInput);
	
	const newButton	= document.createElement('button');
	newButton.setAttribute('id' ,'submitButton');
	newButton.textContent = 'Create!';
	newDiv.appendChild(newButton);
	
	const submitButton = document.querySelector('#submitButton');
	submitButton.addEventListener('click', updateRowCount);	
}; 

function restart() {  //Resets the grid and prompt for grid size
	notReadyToDraw();
	clearGrid();
	promptForGrid();
};

function selectButton() {  //Changes drawing mode between normal, colored, or shaded
	footButtons.forEach(btn => btn.classList.remove('selected'));
	this.classList.toggle('selected');
	mode = this.textContent;
	
	if (drawActive == 'On'){
		const onBox = document.querySelectorAll('.box');
	
		onBox.forEach(box => box.removeEventListener('mouseover', drawNormal));
		onBox.forEach(box => box.removeEventListener('mouseover', drawColored));
		onBox.forEach(box => box.removeEventListener('mouseover', drawShaded));

		if (mode == 'Normal'){
			onBox.forEach(box => box.addEventListener('mouseover', drawNormal));
		} else if (mode == 'Colored'){
			onBox.forEach(box => box.addEventListener('mouseover', drawColored));
		} else {
			onBox.forEach(box => box.addEventListener('mouseover', drawShaded));
		} 
	}
}

drawButton.addEventListener('click', readyToDraw);
restartButton.addEventListener('click', restart);
footButtons.forEach(btn => btn.addEventListener('click', selectButton));

buildGrid();