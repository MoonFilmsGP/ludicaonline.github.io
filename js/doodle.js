const canvas = document.getElementById('doodle-canvas');
const ctx = canvas.getContext('2d');

// Cargar fondo
const bgImage = new Image();
bgImage.src = 'assets/portadas/ludica.jpg';
const sprite = new Image();
sprite.src = 'assets/sprites/player.png';

// Ajustar tamaño
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.6;
}
window.addEventListener('resize', resize);
resize();

// Actualizar encabezado
const headlineEl = document.getElementById('headline');
const leadEl = document.getElementById('lead');
//headlineEl.textContent = 'Expedition Clair Obscur 33: Indie GOTY?';
//leadEl.textContent = '¿Será este el primer indie GOTY de la historia? Prueba su sistema de parry…';

// ==================== ENGINE DEL MONITO ====================

// Config
const gravity = 0.6;
const jumpStrength = -12;
const floorY = canvas.height * 0.75;
const letterSpacing = 120;

// Jugador
const player = {
    frame: 0,
    frameCount: 3,
    frameDelay: 0,
    x: 100,
    y: floorY - 40,
    width: 48,
    height: 72,
    color: '#00f',
    vy: 0,
    onGround: false
};

// Letras como plataformas
const letters = 'LÚDICA'.split('').map((char, i) => ({
    x: 100 + i * letterSpacing,
    y: floorY,
    width: 60,
    height: 20,
    label: char
}));

// Controles
let keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Lógica
function update() {
    if (keys['ArrowLeft'] || keys['a']) player.x -= 5;
    if (keys['ArrowRight'] || keys['d']) player.x += 5;

    if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && player.onGround) {
        player.vy = jumpStrength;
        player.onGround = false;
    }

    player.vy += gravity;
    player.y += player.vy;

    player.onGround = false;
    letters.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height < platform.y + 10 &&
            player.y + player.height + player.vy >= platform.y
        ) {
            player.y = platform.y - player.height;
            player.vy = 0;
            player.onGround = true;
        }
    });

    if (player.y > canvas.height) {
        player.y = floorY - player.height;
        player.vy = 0;
        player.x = 100;
    }

    // Animación del sprite
    if (keys['ArrowLeft'] || keys['ArrowRight'] || keys['a'] || keys['d']) {
        player.frameDelay++;
        if (player.frameDelay > 6) {
            player.frame = (player.frame + 1) % player.frameCount;
            player.frameDelay = 0;
        }
    }
}

// Dibujo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bgImage.complete) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd', '#ee5253'];
    letters.forEach((l, i) => {
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(l.x, l.y, l.width, l.height);
    });

    if (sprite.complete) {
        const frameWidth = 341;
        const frameHeight = 512;
        console.log('Dibujando sprite en', player.x, player.y, 'frame', player.frame);
        ctx.drawImage(
            sprite,
            player.frame * frameWidth, player.onGround ? 0 : frameHeight,
            frameWidth, frameHeight,
            player.x, player.y,
            player.width, player.height
        );
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Esperar a que el sprite cargue antes de iniciar
sprite.onload = () => {
    console.log("Sprite cargado correctamente");
    loop();
};

sprite.onerror = () => {
    console.error("No se pudo cargar el sprite.");
};
