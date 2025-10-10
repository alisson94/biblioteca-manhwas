/**
 * Classe Modal - Gerencia todos os modais da aplicação
 * Substitui as funções repetitivas de modal
 */
class Modal {
    constructor(modalSelector, triggerSelector, closeSelector) {
        this.modal = document.querySelector(modalSelector);
        this.triggers = document.querySelectorAll(triggerSelector);
        this.closeBtn = this.modal?.querySelector(closeSelector);
        
        // Callbacks customizáveis
        this.onOpen = null;
        this.onClose = null;
        this.onBeforeOpen = null;
        
        this.init();
    }
    
    init() {
        if (!this.modal) {
            console.warn(`Modal não encontrado: ${this.modalSelector}`);
            return;
        }
        
        // Event listeners para abrir modal
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });
        
        // Event listener para fechar modal
        this.closeBtn?.addEventListener('click', () => this.close());
        
        // Fechar ao clicar fora do modal
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Fechar com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }
    
    open() {
        if (!this.modal) return;
        
        // Callback antes de abrir
        if (this.onBeforeOpen) {
            this.onBeforeOpen();
        }
        
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Previne scroll
        
        // Adiciona classe para animações CSS (opcional)
        this.modal.classList.add('modal-open');
        
        // Callback após abrir
        if (this.onOpen) {
            this.onOpen();
        }
    }
    
    close() {
        if (!this.modal) return;
        
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Remove classe para animações CSS
        this.modal.classList.remove('modal-open');
        
        // Callback após fechar
        if (this.onClose) {
            this.onClose();
        }
    }
    
    isOpen() {
        return this.modal && this.modal.style.display === 'flex';
    }
    
    // Métodos para definir callbacks
    setOnOpen(callback) {
        this.onOpen = callback;
        return this; // Para chain methods
    }
    
    setOnClose(callback) {
        this.onClose = callback;
        return this; // Para chain methods
    }
    
    setOnBeforeOpen(callback) {
        this.onBeforeOpen = callback;
        return this; // Para chain methods
    }
}

// Para compatibilidade com módulos ES6 (futuro)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Modal;
}