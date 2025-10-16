// Script simples para aplicar delays automáticos nas animações de entrada
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.manhwa-card');
    
    cards.forEach((card, index) => {
        const delay = (index * 0.1) + 0.1; // 0.1s, 0.2s, 0.3s, etc.
        card.style.animationDelay = delay + 's';
    });
});