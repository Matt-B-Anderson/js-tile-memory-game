const grid = document.getElementById("grid");
const startBtn = document.getElementById("start-btn");
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
	sequence = generateSequence();
	userGuesses = new Array(9).fill(null);
	acceptingInput = false;
	flashSequence(sequence, 0);
}

function generateSequence() {
	const newSequence = [];
	for (let i = 0; i < 4; i++) {
		newSequence.push({
			index: Math.floor(Math.random() * 9),
			color: COLORS[Math.floor(Math.random() * COLORS.length)],
		});
	}
	return newSequence;
}

function flashSequence(seq, i) {
	if (i >= seq.length) {
		acceptingInput = true;
		return;
	}
	const { index, color } = seq[i];
	const tile = grid.children[index];
	const prevColor = tile.style.backgroundColor;

	tile.style.backgroundColor = color;
	setTimeout(() => {
		tile.style.backgroundColor = "#ccc";
		setTimeout(() => flashSequence(seq, i + 1), 300);
	}, 600);
}

function checkGuesses() {
	try {
		if (!sequence.length) throw new Error("No sequence to check!");

		const correctColors = sequence.map((s) => s.color);
		const userColors = userGuesses.filter((c) => c !== null);

		const allCorrect =
			correctColors.every((color) => userColors.includes(color)) &&
			correctColors.length === userColors.length;

		if (allCorrect) {
			score++;
			scoreDisplay.textContent = `Score: ${score}`;
			Swal.fire("Correct!", "You matched all colors!", "success");
		} else {
			Swal.fire("Wrong!", "Try again!", "error");
		}
	} catch (err) {
		Swal.fire("Error", err.message, "warning");
	}
}

startBtn.addEventListener("click", startGame);
createGrid();

document.addEventListener("keydown", (e) => {
	if (e.key === "Enter" && acceptingInput) {
		acceptingInput = false;
		checkGuesses();
	}
});
