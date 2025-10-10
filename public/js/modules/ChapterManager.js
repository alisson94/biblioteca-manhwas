/**
 * Classe ChapterManager - Gerencia atualização de capítulos
 * Substitui as funções mudarCapituloAtual e mudarCapituloAtualComBotao
 */
class ChapterManager {
    constructor() {
        this.selectors = document.querySelectorAll('.select-cap-atual');
        this.buttons = document.querySelectorAll('.btn-cap');
        
        this.init();
    }
    
    init() {
        this.setupSelectListeners();
        this.setupButtonListeners();
    }
    
    setupSelectListeners() {
        this.selectors.forEach(select => {
            select.addEventListener('change', async (e) => {
                await this.updateChapter(e.target);
            });
        });
    }
    
    setupButtonListeners() {
        this.buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.handleButtonClick(button, index);
            });
        });
    }
    
    async updateChapter(select) {
        const statusSpan = select.nextElementSibling;
        const manhwaSlug = select.dataset.manhwaSlug;
        const manhwaLink = select.dataset.linkUrl;
        const novoValor = select.value;
        
        // Mostrar feedback de carregamento
        const toastSalvando = showToast("Salvando...", "info");
        
        try {
            const response = await fetch('/manhwa/atualizar-capitulo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    manhwaSlug,
                    manhwaLink,
                    novoValor
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                toastSalvando.remove();
                showToast("Capítulo atualizado com sucesso!", "success");
                
                // Feedback visual adicional (opcional)
                if (statusSpan) {
                    statusSpan.textContent = '✓';
                    statusSpan.style.color = '#4CAF50';
                    
                    setTimeout(() => {
                        statusSpan.textContent = '';
                    }, 2000);
                }
            } else {
                throw new Error(result.message || "Erro ao salvar");
            }
            
        } catch (error) {
            console.error("Erro ao atualizar capítulo:", error);
            toastSalvando.remove();
            showToast("Erro ao salvar: " + error.message, "error");
            
            // Feedback visual de erro
            if (statusSpan) {
                statusSpan.textContent = '✗';
                statusSpan.style.color = '#F44336';
                
                setTimeout(() => {
                    statusSpan.textContent = '';
                }, 3000);
            }
        }
    }
    
    handleButtonClick(button, index) {
        // Encontrar o select correspondente
        const select = this.selectors[Math.floor(index / 2)];
        
        if (!select) return;
        
        let novoValor = parseInt(select.value);
        const capTotal = parseInt(button.dataset.capTotal) || 999;
        
        if (button.textContent === '-') {
            novoValor = Math.max(1, novoValor - 1);
        } else if (button.textContent === '+') {
            novoValor = Math.min(capTotal, novoValor + 1);
        }
        
        // Atualizar valor e disparar evento change
        select.value = novoValor;
        select.dispatchEvent(new Event('change'));
        
        // Feedback visual imediato
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }
    
    // Método utilitário para atualizar capítulo programaticamente
    updateChapterValue(selectElement, newValue) {
        if (selectElement && newValue >= 1) {
            selectElement.value = newValue;
            selectElement.dispatchEvent(new Event('change'));
        }
    }
}

// Para compatibilidade com módulos ES6 (futuro)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChapterManager;
}