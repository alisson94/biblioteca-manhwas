/**
 * Classe LinkModal - Gerencia especificamente os modais de links
 * Lida com preenchimento automático de dados para edição
 */
class LinkModal extends Modal {
    constructor(modalSelector, triggerSelector, closeSelector) {
        super(modalSelector, triggerSelector, closeSelector);
        
        // Elementos do formulário
        this.form = this.modal?.querySelector('form');
        this.linkIdInput = this.modal?.querySelector('#link-id-input');
        this.idiomaSelect = this.modal?.querySelector('#idioma');
        this.urlInput = this.modal?.querySelector('#url');
        this.capTotalInput = this.modal?.querySelector('#cap_total');
        
        this.setupEditMode();
    }
    
    setupEditMode() {
        // Configura botões de edição (que têm IDs específicos)
        const editButtons = document.querySelectorAll('.btn-abrir-modal-atualizar-link');
        
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openForEdit(button);
            });
        });
    }
    
    openForEdit(button) {
        // Buscar dados do link da linha da tabela
        const linkId = button.id;
        const linkRow = button.closest('tr');
        
        if (!linkRow) {
            console.error('Não foi possível encontrar a linha da tabela');
            return;
        }
        
        // Extrair dados da linha
        const idioma = linkRow.cells[0].textContent.trim();
        const url = linkRow.cells[1].querySelector('a')?.href || '';
        const capTotal = linkRow.cells[3].textContent.trim();
        
        // Preencher formulário
        this.fillForm({
            linkId,
            idioma,
            url,
            capTotal
        });
        
        // Abrir modal
        this.open();
    }
    
    fillForm(data) {
        if (!this.form) return;
        
        if (this.linkIdInput) this.linkIdInput.value = data.linkId || '';
        if (this.idiomaSelect) this.idiomaSelect.value = data.idioma || 'PT';
        if (this.urlInput) this.urlInput.value = data.url || '';
        if (this.capTotalInput) this.capTotalInput.value = data.capTotal || '100';
    }
    
    clearForm() {
        if (!this.form) return;
        
        if (this.linkIdInput) this.linkIdInput.value = '';
        if (this.idiomaSelect) this.idiomaSelect.value = 'PT';
        if (this.urlInput) this.urlInput.value = '';
        if (this.capTotalInput) this.capTotalInput.value = '100';
    }
    
    // Override do método close para limpar formulário
    close() {
        super.close();
        // Opcional: limpar formulário ao fechar
        // this.clearForm();
    }
}

// Para compatibilidade com módulos ES6 (futuro)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LinkModal;
}