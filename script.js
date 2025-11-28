const grid = document.getElementById("grid");
const startBtn = document.getElementById("start-btn");
const submitBtn = document.getElementById("submit-btn");
const difficultySelect = document.getElementById("difficulty");
const scoreDisplay = document.getElementById("score");

const COLORS = ["red", "blue", "green", "yellow"];
let sequence = [];
let userGuesses = [];
let score = 0;
let acceptingInput = false;

function createGrid() {
	grid.innerHTML = "";
	for (let i = 0; i < 9; i++) {
		const tile = document.createElement("div");
		tile.classList.add("tile");
		tile.dataset.index = i;
		tile.style.backgroundColor = "#ccc";
		tile.addEventListener("click", onTileClick);
		grid.appendChild(tile);
	}
}

function onTileClick(e) {
	if (!acceptingInput) return;
	const tile = e.target;
	const color = cycleTileColor(tile);
	const index = Number(tile.dataset.index);
	userGuesses[index] = color;
}

function cycleTileColor(tile) {
	const currentColor = tile.style.backgroundColor;
	const nextColor =
		COLORS[(COLORS.indexOf(currentColor) + 1) % COLORS.length] || COLORS[0];
	tile.style.backgroundColor = nextColor;
	return nextColor;
}

function startGame() {
	const difficulty = parseInt(difficultySelect.value, 10);
	sequence = generateUniqueSequence(difficulty);
	userGuesses = new Array(9).fill(null);
	acceptingInput = false;
	submitBtn.disabled = true;

	resetTileColors();
	flashSequence(sequence, 0);
}

function generateUniqueSequence(length) {
	const available = Array.from({ length: 9 }, (_, i) => i);
	const seq = [];

	for (let i = 0; i < length; i++) {
		const randIdx = Math.floor(Math.random() * available.length);
		const tileIndex = available.splice(randIdx, 1)[0];
		const color = COLORS[Math.floor(Math.random() * COLORS.length)];
		seq.push({ index: tileIndex, color });
	}

	return seq;
}

function flashSequence(seq, i) {
	if (i >= seq.length) {
		acceptingInput = true;
		submitBtn.disabled = false;
		return;
	}

	const { index, color } = seq[i];
	const tile = grid.children[index];

	tile.classList.add("flash");

	tile.style.backgroundColor = color;
	setTimeout(() => {
		tile.style.backgroundColor = "#ccc";

		tile.classList.remove("flash");

		setTimeout(() => flashSequence(seq, i + 1), 350);
	}, 600);
}

function checkGuesses() {
	try {
		if (!sequence.length) throw new Error("No sequence to check!");

		acceptingInput = false;
		submitBtn.disabled = true;

		const expectedColors = new Array(9).fill(null);
		sequence.forEach(({ index, color }) => {
			expectedColors[index] = color;
		});

		if (!userGuesses || userGuesses.length !== 9) {
			userGuesses = new Array(9).fill(null);
		}

		let allCorrect = true;
		for (let i = 0; i < 9; i++) {
			const expected = expectedColors[i];
			const actual = userGuesses[i] ?? null;

			if (expected !== actual) {
				allCorrect = false;
				break;
			}
		}

		if (allCorrect) {
			score++;
			scoreDisplay.textContent = `Score: ${score}`;
			Swal.fire("Correct!", "You matched all the tiles correctly!", "success");
		} else {
			Swal.fire(
				"Wrong!",
				"Your tile colors did not match the pattern.",
				"error"
			);
		}

		resetTileColors();
		userGuesses = new Array(9).fill(null);
	} catch (err) {
		Swal.fire("Error", err.message, "warning");
	}
}

function resetTileColors() {
	Array.from(grid.children).forEach((tile) => {
		tile.style.backgroundColor = "#ccc";
	});
}

startBtn.addEventListener("click", startGame);
submitBtn.addEventListener("click", checkGuesses);

createGrid();
