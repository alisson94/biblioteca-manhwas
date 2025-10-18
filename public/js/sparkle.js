let isThrottled = false; // Variável para controlar a frequência do efeito (otimização)

// Adiciona um "ouvinte" para o movimento do mouse no corpo da página
document.body.addEventListener('mousemove', (e) => {
    // Se a função foi chamada recentemente, não faz nada
    if (isThrottled) return; 
    isThrottled = true;
    
    // Define uma pequena espera para a próxima execução
    setTimeout(() => {
        isThrottled = false;
    }, 25); // Cria um brilho a cada 25ms no máximo

    // Chama a função para criar a partícula na posição do mouse
    createSparkle(e.clientX, e.clientY);
});

// Função que cria e anima cada partícula de brilho
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    document.body.appendChild(sparkle);

    // Define um tamanho aleatório para o brilho
    const size = Math.random() * 5 + 2; 
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    
    // Define a cor (branco/amarelado) e o brilho
    const color = `hsla(268, 100%, 66%, 1.00)`;
    sparkle.style.backgroundColor = color;
    sparkle.style.boxShadow = `0 0 8px ${color}, 0 0 12px #fff`;
    sparkle.style.filter = 'blur(1px)';
    
    // Posiciona a partícula no local do cursor
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    // Define a animação de queda
    const destinationX = (Math.random() - 0.5) * 30; // Pequeno desvio lateral aleatório
    const destinationY = Math.random() * 50 + 50;   // Sempre para baixo, com distância variável

    const animation = sparkle.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${destinationX}px), calc(-50% + ${destinationY}px)) scale(0)`, opacity: 0 }
    ], {
        duration: Math.random() * 1200 + 1000, // Duração aleatória para um efeito mais natural
        easing: 'ease-in' // Começa devagar e acelera, como se estivesse caindo
    });

    // Remove a partícula do HTML quando a animação termina
    animation.onfinish = () => {
        sparkle.remove();
    };
}