/**
 * Classe FormManager - Gerencia funcionalidades dinâmicas de formulários
 * Substitui a função adicionarTitulo e outras funcionalidades de form
 */
class FormManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupDynamicTitles();
        this.setupFormValidations();
        this.setupFormSubmissions();
    }
    
    setupDynamicTitles() {
        const btnAdicionarTitulo = document.getElementById('btn-adicionar-titulo');
        
        if (btnAdicionarTitulo) {
            btnAdicionarTitulo.addEventListener('click', () => {
                this.addTitleInput();
            });
        }
    }
    
    addTitleInput() {
        const titulosContainer = document.querySelector('.titulos-container');
        
        if (!titulosContainer) {
            console.warn('Container de títulos não encontrado');
            return;
        }
        
        // Criar novo input
        const novoTitulo = document.createElement('input');
        novoTitulo.type = 'text';
        novoTitulo.name = 'titulos';
        novoTitulo.placeholder = 'Outro título';
        novoTitulo.required = true;
        
        // Adicionar botão de remover
        const containerWrapper = document.createElement('div');
        containerWrapper.className = 'titulo-input-wrapper';
        containerWrapper.style.display = 'flex';
        containerWrapper.style.gap = '0.5rem';
        containerWrapper.style.alignItems = 'center';
        
        const btnRemover = document.createElement('button');
        btnRemover.type = 'button';
        btnRemover.textContent = '×';
        btnRemover.className = 'btn-remove-title';
        btnRemover.style.cssText = `
            background: #F44336;
            color: white;
            border: none;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
        `;
        
        // Event listener para remover
        btnRemover.addEventListener('click', () => {
            containerWrapper.remove();
        });
        
        containerWrapper.appendChild(novoTitulo);
        containerWrapper.appendChild(btnRemover);
        titulosContainer.appendChild(containerWrapper);
        
        // Focar no novo input
        novoTitulo.focus();
        
        // Animação suave (opcional)
        containerWrapper.style.opacity = '0';
        containerWrapper.style.transform = 'translateY(-10px)';
        
        requestAnimationFrame(() => {
            containerWrapper.style.transition = 'all 0.3s ease';
            containerWrapper.style.opacity = '1';
            containerWrapper.style.transform = 'translateY(0)';
        });
    }
    
    setupFormValidations() {
        // Validação de URLs
        const urlInputs = document.querySelectorAll('input[type="url"]');
        
        urlInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateUrl(input);
            });
        });
        
        // Validação de números
        const numberInputs = document.querySelectorAll('input[type="number"]');
        
        numberInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateNumber(input);
            });
        });
    }
    
    validateUrl(input) {
        const value = input.value.trim();
        
        if (value && !this.isValidUrl(value)) {
            this.showInputError(input, 'URL inválida');
            return false;
        }
        
        this.clearInputError(input);
        return true;
    }
    
    validateNumber(input) {
        const value = parseInt(input.value);
        const min = parseInt(input.min) || 1;
        const max = parseInt(input.max) || Infinity;
        
        if (isNaN(value) || value < min || value > max) {
            this.showInputError(input, `Valor deve estar entre ${min} e ${max === Infinity ? '∞' : max}`);
            return false;
        }
        
        this.clearInputError(input);
        return true;
    }
    
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    showInputError(input, message) {
        this.clearInputError(input);
        
        input.style.borderColor = '#F44336';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'input-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #F44336;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        `;
        
        input.parentNode.appendChild(errorDiv);
    }
    
    clearInputError(input) {
        input.style.borderColor = '';
        
        const existingError = input.parentNode.querySelector('.input-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    setupFormSubmissions() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }
    
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showInputError(input, 'Campo obrigatório');
                isValid = false;
            } else if (input.type === 'url') {
                if (!this.validateUrl(input)) {
                    isValid = false;
                }
            } else if (input.type === 'number') {
                if (!this.validateNumber(input)) {
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
}

// Para compatibilidade com módulos ES6 (futuro)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormManager;
}