# Nokia 3310 Snake Game

A retro-style Snake game built with HTML5, CSS3, and JavaScript, mimicking the classic Nokia 3310 aesthetics.

## Features
- Classic Snake gameplay
- Nokia 3310 green monochrome theme
- High score tracking (saved locally)
- Mobile-friendly controls (D-pad)
- Docker support

## How to Run Locally
Simply open `index.html` in your web browser.

## How to Run with Docker

1. Build the Docker image:
   ```bash
   docker build -t snake-game .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:80 snake-game
   ```

3. Open your browser and navigate to `http://localhost:8080`.

## Controls
- **Desktop**: Use Arrow keys to move.
- **Mobile**: Use the on-screen D-pad.
