const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameOverElement = document.getElementById('game-over');

// Game constants
const GRID_SIZE = 20;
const TILE_COUNT_X = canvas.width / GRID_SIZE;
const TILE_COUNT_Y = canvas.height / GRID_SIZE;
const GAME_SPEED = 250; // ms (Lower speed)

// Game state
let snake = [];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop;
let isGameOver = false;
let isGameRunning = false;

// Colors
const COLOR_BG = '#c7f0d8';
const COLOR_FG = '#43523d';

highScoreElement.textContent = `Hi: ${highScore}`;

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    dx = 1;
    dy = 0;
    score = 0;
    isGameOver = false;
    isGameRunning = true;
    scoreElement.textContent = `Score: ${score}`;
    gameOverElement.classList.add('hidden');
    spawnFood();

    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, GAME_SPEED);
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * TILE_COUNT_X),
        y: Math.floor(Math.random() * TILE_COUNT_Y)
    };
    // Check if food spawned on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            spawnFood();
            break;
        }
    }
}

function update() {
    if (isGameOver) return;

    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall collision
    if (head.x < 0 || head.x >= TILE_COUNT_X || head.y < 0 || head.y >= TILE_COUNT_Y) {
        endGame();
        return;
    }

    // Self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        spawnFood();
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    // Clear screen
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = COLOR_FG;
    for (let segment of snake) {
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    }

    // Draw food
    ctx.fillStyle = COLOR_FG;
    // Draw food as a circle/diamond for variety? No, stick to pixels for Nokia style
    ctx.fillRect(food.x * GRID_SIZE + 2, food.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);

    // Draw inner detail for food to look like a fruit
    ctx.clearRect(food.x * GRID_SIZE + 6, food.y * GRID_SIZE + 6, GRID_SIZE - 12, GRID_SIZE - 12);
}

function endGame() {
    isGameOver = true;
    isGameRunning = false;
    clearInterval(gameLoop);
    gameOverElement.classList.remove('hidden');

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.textContent = `Hi: ${highScore}`;
    }
}

// Input handling
document.addEventListener('keydown', (e) => {
    if (isGameOver && !isGameRunning) {
        initGame();
        return;
    }

    switch (e.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

// Mobile Controls
document.getElementById('up-btn').addEventListener('click', () => { if (dy !== 1) { dx = 0; dy = -1; } });
document.getElementById('down-btn').addEventListener('click', () => { if (dy !== -1) { dx = 0; dy = 1; } });
document.getElementById('left-btn').addEventListener('click', () => { if (dx !== 1) { dx = -1; dy = 0; } });
document.getElementById('right-btn').addEventListener('click', () => { if (dx !== -1) { dx = 1; dy = 0; } });

// Start game on load
initGame();
