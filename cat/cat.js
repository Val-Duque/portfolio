// Interactividad del gatito
const catAnimation = document.querySelector('.cat-animation');
const cat = document.querySelector('.cat');

let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

// Detener la animación automática al cargar
catAnimation.style.animation = 'none';
catAnimation.style.left = '50px';
catAnimation.style.bottom = '30px';

// Función para hacer que el gato maúlle (animación de boca)
function meow() {
    const mouth = document.querySelector('.cat-mouth');
    const head = document.querySelector('.cat-head');
    
    mouth.style.transition = 'transform 0.15s ease';
    mouth.style.transform = 'translateX(-50%) scale(1.3)';
    head.style.transform = 'scaleY(1.05)';
    
    console.log('¡Miau! 🐱');
    
    setTimeout(() => {
        mouth.style.transform = 'translateX(-50%) scale(1)';
        head.style.transform = 'scaleY(1)';
    }, 200);
}

// Click en el gato para que maúlle
cat.addEventListener('click', (e) => {
    e.stopPropagation();
    meow();
    
    // Animación de salto más natural
    catAnimation.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    catAnimation.style.transform = 'translateY(-15px)';
    
    setTimeout(() => {
        catAnimation.style.transition = 'transform 0.3s ease-out';
        catAnimation.style.transform = 'translateY(0)';
    }, 200);
});

// Arrastrar el gato
catAnimation.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

// Touch events para móviles
catAnimation.addEventListener('touchstart', dragStart);
document.addEventListener('touchmove', drag);
document.addEventListener('touchend', dragEnd);

function dragStart(e) {
    if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    if (e.target === catAnimation || catAnimation.contains(e.target)) {
        isDragging = true;
        catAnimation.style.cursor = 'grabbing';
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        
        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        // Movimiento más suave
        catAnimation.style.transition = 'none';
        setTranslate(currentX, currentY, catAnimation);
        
        // Inclinar ligeramente el gato al moverlo
        const tiltAngle = (currentX - xOffset) * 0.05;
        cat.style.transform = `rotate(${tiltAngle}deg)`;
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    catAnimation.style.cursor = 'grab';
    
    // Volver a la posición normal suavemente
    cat.style.transition = 'transform 0.3s ease-out';
    cat.style.transform = 'rotate(0deg)';
}

function setTranslate(xPos, yPos, el) {
    el.style.left = xPos + 'px';
    el.style.bottom = 'auto';
    el.style.top = yPos + 'px';
}

// Hacer que el gato siga el cursor (modo seguir)
let followMode = false;

document.addEventListener('keydown', (e) => {
    // Presiona 'F' para activar/desactivar modo seguir
    if (e.key === 'f' || e.key === 'F') {
        followMode = !followMode;
        console.log(followMode ? '🐱 Modo seguir activado' : '🐱 Modo seguir desactivado');
        
        if (followMode) {
            catAnimation.style.transition = 'left 0.5s ease, top 0.5s ease';
        } else {
            catAnimation.style.transition = 'none';
        }
    }
    
    // Presiona 'W' para hacer caminar al gato
    if (e.key === 'w' || e.key === 'W') {
        walkAcrossScreen();
    }
    
    // Presiona 'R' para resetear posición
    if (e.key === 'r' || e.key === 'R') {
        resetPosition();
    }
});

let lastMouseX = 0;
let lastMouseY = 0;

document.addEventListener('mousemove', (e) => {
    if (followMode && !isDragging) {
        const mouseX = e.clientX - 40; // Centrar el gato más pequeño
        const mouseY = e.clientY - 40;
        
        // Movimiento más suave con interpolación
        catAnimation.style.transition = 'left 0.3s ease-out, top 0.3s ease-out';
        catAnimation.style.left = mouseX + 'px';
        catAnimation.style.top = mouseY + 'px';
        catAnimation.style.bottom = 'auto';
        
        // Voltear el gato según la dirección con transición suave
        const deltaX = e.clientX - lastMouseX;
        if (Math.abs(deltaX) > 2) {
            cat.style.transition = 'transform 0.3s ease-out';
            if (deltaX > 0) {
                cat.style.transform = 'scaleX(1)';
            } else if (deltaX < 0) {
                cat.style.transform = 'scaleX(-1)';
            }
        }
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }
});

// Función para hacer caminar al gato por la pantalla
function walkAcrossScreen() {
    catAnimation.style.transition = 'none';
    catAnimation.style.animation = 'walkAndJump 12s ease-in-out';
    catAnimation.style.left = '-100px';
    catAnimation.style.bottom = '30px';
    catAnimation.style.top = 'auto';
    cat.style.transform = 'scaleX(1)';
    
    setTimeout(() => {
        catAnimation.style.animation = 'none';
        catAnimation.style.transition = 'left 0.5s ease-out';
        catAnimation.style.left = '50px';
    }, 12000);
}

// Resetear posición
function resetPosition() {
    catAnimation.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    catAnimation.style.left = '50px';
    catAnimation.style.bottom = '30px';
    catAnimation.style.top = 'auto';
    catAnimation.style.transform = 'none';
    
    cat.style.transition = 'transform 0.4s ease-out';
    cat.style.transform = 'scaleX(1) rotate(0deg)';
    
    xOffset = 0;
    yOffset = 0;
    
    // Pequeño rebote al resetear
    setTimeout(() => {
        catAnimation.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            catAnimation.style.transform = 'translateY(0)';
        }, 200);
    }, 100);
}

// Cursor personalizado
catAnimation.style.cursor = 'grab';
catAnimation.style.pointerEvents = 'auto';

// Mostrar instrucciones
console.log(`
🐱 Controles del gatito:
- Click: Hacer que maúlle y salte
- Arrastrar: Mover el gato
- Tecla F: Activar/desactivar modo seguir cursor
- Tecla W: Hacer caminar al gato
- Tecla R: Resetear posición
`);
