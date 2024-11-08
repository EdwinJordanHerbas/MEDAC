// Variables de pantalla y botones
const startScreen = document.getElementById("start-screen");
const resultsScreen = document.getElementById("results-screen");
const playButton = document.getElementById("play-button");
const resultsButton = document.getElementById("results-button");
const backButton = document.getElementById("back-button");

// Configuración del canvas y contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Variables del juego
let ship = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 50, speed: 5 };
let bullets = [];
let enemies = [];
let score = 0;
let level = 1;
let lives = 3;
let gameActive = false;
let enemyWordsLevel1 = [
  "Thier", "Recieve", "Definately", "Febuary", "Tommorow", "Mispell",
  "Acomodate", "Seperate", "Writting", "Occured", "Enviroment", "Beggining",
  "Govornment", "Freind", "Tounge", "Gramaphone", "Embaras", "Asume",
  "Posession", "Persue", "Awfull", "Awkword", "Benifit", "Buisness",
  "Calender", "Commitee", "Conceed", "Desparate", "Dissapear", "Employe"
]; // Ejemplo de palabras incorrectas

let keys = { right: false, left: false, space: false };

// Eventos de botones
playButton.addEventListener("click", startGame);
resultsButton.addEventListener("click", showResultsScreen);
backButton.addEventListener("click", showStartScreen);

// Funciones de pantalla
function showStartScreen() {
    startScreen.style.display = "flex";
    resultsScreen.style.display = "none";
    canvas.style.display = "none";
    gameActive = false; // Detiene el juego al regresar a la pantalla de inicio
}

function showResultsScreen() {
    startScreen.style.display = "none";
    resultsScreen.style.display = "flex";
    canvas.style.display = "none";
}

function startGame() {
    level = 1; // Siempre inicia en el nivel 1
    score = 0;
    lives = 3;
    enemies = [];
    bullets = [];
    gameActive = true;
    startScreen.style.display = "none";
    resultsScreen.style.display = "none";
    canvas.style.display = "block";
    requestAnimationFrame(gameLoop);
}

// Cargar imágenes
let shipImage = new Image();
shipImage.src = 'NaveEspacial.png';
let bulletImage = new Image();
bulletImage.src = 'medacSin.png';

// Eventos de teclado
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight") keys.right = true;
  if (e.code === "ArrowLeft") keys.left = true;
  if (e.code === "Space") keys.space = true;
});
document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowRight") keys.right = false;
  if (e.code === "ArrowLeft") keys.left = false;
  if (e.code === "Space") keys.space = false;
});

let canShoot = true; // Variable para controlar si se puede disparar

function moveShip() {
  if (keys.right && ship.x + ship.width < canvas.width) {
    ship.x += ship.speed;
  }
  if (keys.left && ship.x > 0) {
    ship.x -= ship.speed;
  }
  if (keys.space && canShoot) {
    shoot();
  }
}

// Disparar balas
function shoot() {
  let bullet = { x: ship.x + ship.width / 2 - 5, y: ship.y, width: 10, height: 10, speed: 10 };
  bullets.push(bullet);
  canShoot = false;
  setTimeout(() => canShoot = true, 300);  // No se puede disparar hasta que pase 1 segundo
}

// Crear enemigos
function createEnemy() {
  let enemyText = enemyWordsLevel1[Math.floor(Math.random() * enemyWordsLevel1.length)];

  let enemy = {
    x: Math.random() * (canvas.width - 50),
    y: -50,
    width: 90,
    height: 60,
    speed:  1,
    text: enemyText,
  };
  enemies.push(enemy);
}

// Actualizar balas
function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });
}

// Actualizar enemigos
function updateEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
      lives--;
    }
  });
}

// Comprobar colisiones
function checkCollisions() {
    bullets.forEach((bullet, i) => {
      enemies.forEach((enemy, j) => {
        if (bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y) {
  
          score += enemy.text.length;
          bullets.splice(i, 1);
          enemies.splice(j, 1);
        }
      });
    });
  }
  

// Dibujar elementos del juego
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);
  bullets.forEach(b => ctx.drawImage(bulletImage, b.x, b.y, b.width *2, b.height *2));
  enemies.forEach(e => {
    ctx.fillStyle = "red";
    ctx.font = "20px Arial";
    if (level === 2) {
      ctx.fillText(e.originalText, e.x, e.y);
    } else {
      ctx.fillText(e.text, e.x, e.y);
    }
  });
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("Lives: " + lives, 10, 40);
}

function checkLevelUp() {
    if (score >= 100 && level === 1) {
      level = 2;
      canShoot = false;
      enemies.forEach(enemy => enemy.speed *= 2);
      setTimeout(() => canShoot = true, 150); // Aumenta la velocidad de disparo
      
      // Mostrar "Nivel 2" en la pantalla
      ctx.fillStyle = "yellow";
      ctx.font = "40px Arial";
      ctx.fillText("Nivel 2", canvas.width / 2 - 50, canvas.height / 2);
      
      // Esperar un segundo antes de continuar
      setTimeout(() => requestAnimationFrame(gameLoop), 20000);
    }
  }

  function checkGameOver() {
    if (lives <= 0) {
      gameActive = false;
  
      // Mostrar "Game Over" en la pantalla
      ctx.fillStyle = "red";
      ctx.font = "40px Arial";
      ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
      
      // Mostrar pantalla de resultados después de un segundo
      setTimeout(showResultsScreen, 1000);
    }
  }



// Lógica del juego (bucle principal)
function gameLoop() {
  if (gameActive) {
    if (Math.random() < 0.02) {
      createEnemy();
    }
    moveShip();
    updateBullets();
    updateEnemies();
    checkCollisions();
    draw();
    checkLevelUp();
    checkGameOver();
    requestAnimationFrame(gameLoop);
  }
}

// Iniciar pantalla de inicio
showStartScreen();