/**
 * MAIN.JS REFATORADO
 * Arquivo principal que orquestra todos os módulos
 * Substitui as 241 linhas originais por código modular e reutilizável
 */

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Biblioteca Manhwas - Inicializando aplicação...');
    
    initializeModals();
    initializeManagers();
    
    console.log('✅ Aplicação inicializada com sucesso!');
});

/**
 * Inicializa todos os modais da aplicação
 */
function initializeModals() {
    // Modal de Manhwa (adicionar/atualizar)
    const manhwaModal = new Modal(
        '#modal-manhwa', 
        '.btn-abrir-modal', 
        '#btn-fechar-modal'
    );
    
    // Callback personalizado quando abrir modal de atualização
    const btnAtualizarManhwa = document.getElementById('btn-abrir-modal-atualizar');
    if (btnAtualizarManhwa) {
        btnAtualizarManhwa.addEventListener('click', () => {
            manhwaModal.open();
        });
    }
    
    // Modal de Link - Adicionar
    const linkAdicionarModal = new Modal(
        '.modal-link-adicionar',
        '#btn-abrir-modal-link',
        '.btn-fechar-modal-link'
    );
    
    // Modal de Link - Atualizar (com funcionalidade especial)
    const linkAtualizarModal = new LinkModal(
        '.modal-link-atualizar',
        '.btn-abrir-modal-atualizar-link',
        '.btn-fechar-modal-link'
    );
    
    // Callback para limpar formulário ao fechar modal de adicionar
    linkAdicionarModal.setOnClose(() => {
        const form = document.querySelector('.modal-link-adicionar form');
        if (form) {
            form.reset();
        }
    });
    
    console.log('✅ Modais inicializados');
}

/**
 * Inicializa todos os gerenciadores da aplicação
 */
function initializeManagers() {
    // Gerenciador de capítulos
    const chapterManager = new ChapterManager();
    
    // Gerenciador de formulários
    const formManager = new FormManager();
    
    console.log('✅ Gerenciadores inicializados');
}

/**
 * Funções utilitárias globais
 * (mantidas para compatibilidade com código existente)
 */

// Função para mostrar toast (já existe no seu código)
// A função showToast já está definida em toast.js

/**
 * API para adicionar funcionalidades futuras
 */
window.ManhwaApp = {
    // Expor classes para uso externo se necessário
    Modal,
    LinkModal,
    ChapterManager,
    FormManager,
    
    // Métodos utilitários
    openModal: (selector) => {
        const modal = document.querySelector(selector);
        if (modal) {
            modal.style.display = 'flex';
        }
    },
    
    closeModal: (selector) => {
        const modal = document.querySelector(selector);
        if (modal) {
            modal.style.display = 'none';
        }
    }
};