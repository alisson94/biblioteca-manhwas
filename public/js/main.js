
document.addEventListener('DOMContentLoaded', () => {
    const btnAbrirModal1 = document.getElementsByClassName('btn-abrir-modal')[0];
    const btnAbrirModal2 = document.getElementsByClassName('btn-abrir-modal')[1];
    const btnFecharModal = document.getElementById('btn-fechar-modal');
    const modal = document.getElementById('modal-adicionar');

    
    if (btnAbrirModal1 && btnAbrirModal2 && btnFecharModal && modal) {

        // Função para abrir o modal
        const abrirModal = () => {
            modal.style.display = 'flex'; // Torna o modal visível
        };

        // Função para fechar o modal
        const fecharModal = () => {
            modal.style.display = 'none'; // Esconde o modal
        };

        // Adiciona um "ouvinte de evento" ao botão de abrir.
        // Quando for clicado, ele vai chamar a função abrirModal.
        btnAbrirModal1.addEventListener('click', abrirModal);
        btnAbrirModal2.addEventListener('click', abrirModal);

        // Adiciona um "ouvinte" ao botão de fechar.
        btnFecharModal.addEventListener('click', fecharModal);

        // Adiciona um "ouvinte" para fechar o modal se o usuário clicar fora da caixa de conteúdo
        modal.addEventListener('click', (event) => {
            // Se o alvo do clique for o fundo cinza (o próprio modal-overlay)...
            if (event.target === modal) {
                fecharModal();
            }
        });
    }

    // ----- LOGICA PARA MODAL DA PAG DETALHES -----
    const btnAbrirModalLink = document.getElementById('btn-abrir-modal-link');
    const btnFecharModalLink = document.getElementById('btn-fechar-modal-link');
    const modalLink = document.getElementById('modal-adicionar-link');
    
    
    if (btnAbrirModalLink && btnFecharModalLink && modalLink) {
        const abrirModalLink = () => { modalLink.style.display = 'flex'; };
        const fecharModalLink = () => { modalLink.style.display = 'none'; };

        btnAbrirModalLink.addEventListener('click', abrirModalLink);
        btnFecharModalLink.addEventListener('click', fecharModalLink);
        modalLink.addEventListener('click', (event) => {
            if (event.target === modalLink) {
                fecharModalLink();
            }
        });
    }
});