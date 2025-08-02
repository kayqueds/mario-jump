const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreElement = document.getElementById('score');
const gameContainer = document.querySelector('.game-board');
const clouds = document.querySelector('.clouds');

let score = 0;
let isGameOver = false;
let isPaused = false;

const somPulo = new Audio('songs/pulo.wav');
const somFase = new Audio('songs/fundo.wav');
somFase.loop = true;
somFase.volume = 0.4;

const somGameOver = new Audio('songs/game_over_mario.wav');
somGameOver.volume = 0.8;

somFase.play();

const inimigo = document.createElement('img');
inimigo.src = 'img/enemy1.gif';
inimigo.classList.add('inimigo');

const inimigo2 = document.createElement('img');
inimigo2.classList.add('inimigo2');
inimigo2.src = 'img/enemy2.gif';

// Função de pulo
const jump = () => {
  if (!isGameOver && !isPaused) {
    mario.classList.add('jump');
    setTimeout(() => {
      mario.classList.remove('jump');
    }, 500);
  }
};

// Loop do jogo
const loop = setInterval(() => {
  if (isGameOver || isPaused) return;

  const pipePosition = pipe.offsetLeft;
  const enemy1Position = inimigo.offsetLeft;
  const enemy2Position = inimigo2.offsetLeft;
  const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

  // Colisão com o cano
  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;

    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;
    mario.src = 'img/game-over.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';

    document.body.style.background = 'linear-gradient(to right, #000, #000)';
    document.body.style.transition = 'background 2s ease-in-out';
    isGameOver = true;
    somFase.pause();
    somGameOver.play();
    clearInterval(loop);
    clearInterval(scoreInterval);

    setTimeout(() => {
      Swal.fire({
        title: "Game Over!",
        text: "Sua pontuação: " + score,
        imageUrl: "img/game-over.png",
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Game Over",
        confirmButtonText: `<i class="fa-solid fa-rotate-right"></i> Tentar novamente`,
        confirmButtonColor: '#ca6410ff',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    }, 300);
  }

  // Colisão com o inimigo
  if ((enemy1Position <= 120 && enemy1Position > 0 && marioPosition < 80) ||
      (enemy2Position <= 120 && enemy2Position > 0 && marioPosition < 80)) {
    if (gameContainer.contains(inimigo)) {
      inimigo.style.animation = 'none';
      inimigo.style.left = `${enemy1Position}px`;
    }
    if (gameContainer.contains(inimigo2)) {
      inimigo2.style.animation = 'none';
      inimigo2.style.left = `${enemy2Position}px`;
    }

    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;
    mario.src = 'img/game-over.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';

    document.body.style.background = 'linear-gradient(to right, #000, #000)';
    document.body.style.transition = 'background 2s ease-in-out';
    isGameOver = true;
    somFase.pause();
    somGameOver.play();
    clearInterval(loop);
    clearInterval(scoreInterval);

    setTimeout(() => {
      Swal.fire({
        title: "Game Over!",
        text: "Sua pontuação: " + score,
        imageUrl: "img/game-over.png",
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Game Over",
        confirmButtonText: `<i class="fa-solid fa-rotate-right"></i> Tentar novamente`,
        confirmButtonColor: '#ca6410ff',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    }, 300);
  }
}, 10);

// Troca de fundo e introdução do inimigo
const changeBackground = () => {
  if (score >= 300 && !gameContainer.contains(inimigo)) {
    gameContainer.style.background = 'linear-gradient(to right, #351746ff, #534d47ff)';
    gameContainer.style.transition = 'background 2s ease-in-out';
    clouds.src = 'img/moon.webp';
    clouds.style.width = '120px';
    clouds.style.top = '30px';

    inimigo.style.display = 'block';
    inimigo.style.right = '-80px';
    inimigo.style.animation = 'pipe-animation 1.5s linear infinite';
    gameContainer.appendChild(inimigo);

    if (gameContainer.contains(pipe)) {
      pipe.style.animation = 'none';
      pipe.remove();
    }
  }
  if (score >= 500){
    gameContainer.style.background = 'linear-gradient(to right, #6e0d25, #1f0303)';
    clouds.src = 'img/ship.png';
    clouds.classList.add('clouds');
    inimigo.src = 'img/enemy2.gif';
    inimigo.style.right = '-80px';
    inimigo.style.animation = 'pipe-animation 1.5s linear infinite';
    inimigo.style.width = '200px';
  }                                           
}

// Parar jogo com mensagem de parabéns
const stopGame = () => {
  clearInterval(loop);
  clearInterval(scoreInterval);

  setTimeout(() => {
    Swal.fire({
      title: "Parabéns!",
      text: "Você completou o jogo com uma pontuação de: " + score,
      imageUrl: "img/congrats.gif",
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: "Congratulations",
      confirmButtonText: `<i class="fa-solid fa-rotate-right"></i> Tentar novamente`,
      confirmButtonColor: '#ca6410ff',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  }, 300);
}

// Atualiza o fundo
const updateBackground = setInterval(() => {
  if (!isPaused) changeBackground();
}, 200);

// Score automático
const scoreInterval = setInterval(() => {
  if (!isGameOver && !isPaused) {
    score++;
    scoreElement.textContent = score;

    if (score >= 700) {
      isGameOver = true;
      stopGame();
      const congratulationSound = new Audio('songs/congrats.wav');
      congratulationSound.volume = 0.8;
      congratulationSound.play();
    }
  }
}, 100);

// Tecla para pular
document.addEventListener('keydown', function (event) {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    event.preventDefault();
    jump();
    somPulo.currentTime = 0;
    somPulo.play();
  }
});

// Função de pause
function pausar() {
  isPaused = !isPaused;

  const btn = document.querySelector('.pause-button');

  if (isPaused) {
    somFase.pause();
    btn.innerHTML = `<i class="fa-solid fa-play"></i> Continuar `;

    mario.style.animationPlayState = 'paused';
    inimigo.style.animationPlayState = 'paused';
    inimigo2.style.animationPlayState = 'paused';
    if (pipe) pipe.style.animationPlayState = 'paused';

  } else {
    if (!isGameOver) somFase.play();
btn.innerHTML = `<i class="fa-solid fa-pause"></i> Pausar`;

    mario.style.animationPlayState = 'running';
    inimigo.style.animationPlayState = 'running';
    inimigo2.style.animationPlayState = 'running';
    if (pipe) pipe.style.animationPlayState = 'running';
  }
}
