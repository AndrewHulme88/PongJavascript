// Define the Ball class
class Ball {
  constructor() {
      // Create a new Path2D object for the ball's shape
      this.shape = new Path2D();
      // Define the ball's shape as a circle
      this.shape.arc(0, 0, 10, 0, Math.PI * 2);
      // Set the ball's color to white
      this.color = "white";
      // Initialize the ball's position to the center of the canvas
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      // Set the ball's initial movement direction and speed
      this.x_move = Math.random() < 0.5 ? -3 : 3;
      this.y_move = Math.random() < 0.5 ? -3 : 3;
  }

  // Reset the ball's position to the center of the canvas
  resetBall() {
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.x_move = Math.random() < 0.5 ? -3 : 3;
      this.y_move = Math.random() < 0.5 ? -3 : 3;
  }

  // Move the ball based on its current direction and speed
  launchBall() {
      this.x += this.x_move;
      this.y += this.y_move;
  }

  // Reverse the ball's y-direction when it hits the top or bottom of the canvas
  bounceY() {
      this.y_move *= -1;
  }

  // Reverse the ball's x-direction when it hits a paddle
  bounceX() {
      this.x_move *= -1;
  }
}

// Define the Paddle class
class Paddle {
  constructor(x, y) {
      // Set the paddle's width and height
      this.width = 10;
      this.height = 50;
      // Set the paddle's color to white
      this.color = "white";
      // Initialize the paddle's position
      this.x = x;
      this.y = y;
      // Set the paddle's speed
      this.speed = 0;
      this.maxSpeed = 10;
  }

  // Move the paddle up
  goUp() {
      this.speed = -this.maxSpeed;
  }

  // Move the paddle down
  goDown() {
      this.speed = this.maxSpeed;
  }

  // Update the paddle's position
  update() {
      this.y += this.speed;
      this.speed *= 0.9; // slow down the paddle

      // Prevent the paddle from moving past the top and bottom of the screen
      if (this.y - this.height / 2 < 0) {
          this.y = this.height / 2;
      } else if (this.y + this.height / 2 > canvas.height) {
          this.y = canvas.height - this.height / 2;
      }
  }

  // Reset the paddle's position
  resetPaddle() {
      this.y = canvas.height / 2;
  }
}

// Define the Score class
class Score {
  constructor() {
      // Initialize the scores for both players
      this.scoreLeft = 0;
      this.scoreRight = 0;
  }

  // Update the score display
  updateScore() {
      document.getElementById("scoreLeft").textContent = this.scoreLeft;
      document.getElementById("scoreRight").textContent = this.scoreRight;
  }

  // Increment the left player's score and update the display
  leftPoint() {
      this.scoreLeft += 1;
      this.updateScore();
  }

  // Increment the right player's score and update the display
  rightPoint() {
      this.scoreRight += 1;
      this.updateScore();
  }
}

// Get the canvas element and its 2D drawing context
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Create the paddles and ball
const rightPaddle = new Paddle(750, canvas.height / 2);
const leftPaddle = new Paddle(50, canvas.height / 2);
const ball = new Ball();
const score = new Score();

// Add event listeners for key presses
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
      rightPaddle.goUp();
  } else if (event.key === "ArrowDown") {
      rightPaddle.goDown();
  } else if (event.key === "w" && gameMode === "2player") {
      leftPaddle.goUp();
  } else if (event.key === "s" && gameMode === "2player") {
      leftPaddle.goDown();
  }
});

// Main game loop
function update() {
  // Update the paddles
  rightPaddle.update();
  if (gameMode === "2player") {
      leftPaddle.update();
  } else {
      // AI control for the left paddle
      if (ball.y < leftPaddle.y) {
          leftPaddle.goUp();
      } else if (ball.y > leftPaddle.y) {
          leftPaddle.goDown();
      }
      leftPaddle.update();
  }

  // Check for collisions with the top and bottom of the canvas
  if (ball.y < 0 || ball.y > canvas.height) {
      ball.bounceY();
  }

  // Check for collisions with the left and right edges of the canvas
  if (ball.x < 0 || ball.x > canvas.width) {
      // If the ball hits the left edge, increment the right player's score
      if (ball.x < 0) {
          score.rightPoint();
      } else {
          // If the ball hits the right edge, increment the left player's score
          score.leftPoint();
      }
      // Reset the ball's position
      ball.resetBall();
  }

  // Check for collisions with the paddles
  if (ball.x < leftPaddle.x + leftPaddle.width && ball.x > leftPaddle.x && ball.y > leftPaddle.y - leftPaddle.height / 2 && ball.y < leftPaddle.y + leftPaddle.height / 2) {
      ball.bounceX();
  } else if (ball.x > rightPaddle.x - rightPaddle.width && ball.x < rightPaddle.x && ball.y > rightPaddle.y - rightPaddle.height / 2 && ball.y < rightPaddle.y + rightPaddle.height / 2) {
      ball.bounceX();
  }

  // Move the ball
  ball.launchBall();

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the paddles
  ctx.fillStyle = rightPaddle.color;
  ctx.fillRect(rightPaddle.x - rightPaddle.width / 2, rightPaddle.y - rightPaddle.height / 2, rightPaddle.width, rightPaddle.height);
  ctx.fillStyle = leftPaddle.color;
  ctx.fillRect(leftPaddle.x - leftPaddle.width / 2, leftPaddle.y - leftPaddle.height / 2, leftPaddle.width, leftPaddle.height);

  // Draw the ball
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
  ctx.fill();

  // Update the score display
  score.updateScore();

  // Check for a win condition
  if (score.scoreLeft === 5 || score.scoreRight === 5) {
      const gameOverDiv = document.getElementById("gameOver");
      const winnerText = document.getElementById("winnerText");
      const playAgainButton = document.getElementById("playAgainButton");

      gameOverDiv.style.display = "block";
      if (score.scoreLeft === 5) {
          winnerText.textContent = "Player 1 wins!";
      } else {
          winnerText.textContent = "Player 2 wins!";
      }

      playAgainButton.addEventListener("click", () => {
          score.scoreLeft = 0;
          score.scoreRight = 0;
          score.updateScore();
          ball.resetBall();
          rightPaddle.resetPaddle();
          leftPaddle.resetPaddle();
          gameOverDiv.style.display = "none";
          update(); // Restart the game loop
      });

      return;
  }

  // Request the next frame
  requestAnimationFrame(update);
}

// Start the game loop
let gameMode;
const startGameDiv = document.getElementById("startGame");
const twoPlayerButton = document.getElementById("twoPlayerButton");
const aiButton = document.getElementById("aiButton");

twoPlayerButton.addEventListener("click", () => {
  gameMode = "2player";
  startGameDiv.style.display = "none";
  update(); // Start the game loop
});

aiButton.addEventListener("click", () => {
  gameMode = "ai";
  startGameDiv.style.display = "none";
  update(); // Start the game loop
});
