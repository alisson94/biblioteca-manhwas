function mostrarModalAdicionarManhwa(){
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
}

function mostrarModalAdicionarLink(){
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
}

function mudarCapituloAtual() {
    const seletoresCapitulos = document.querySelectorAll('.select-cap-atual')

    seletoresCapitulos.forEach(select => {
        select.addEventListener('change', async () => {
            const statusSpan = select.nextElementSibling
            const manhwaSlug = select.dataset.manhwaSlug
            const manhwaLink = select.dataset.linkUrl
            const novoValor = select.value

            const toastSalvando = showToast("Salvando...", "info")

            try{
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
                }) 

                await response.json();

                if(response.ok){
                    toastSalvando.remove()
                    showToast("Capítulo atualizado com sucesso!", "success");

                }else{
                    throw new Error("Erro ao salvar");
                    
                }
            }catch(e){
                console.error("Erro: ", e);
                showToast("Erro ao salvar", "error");

            }

            setTimeout(()=>{
                statusSpan.textContent = ''
            }, 2000)
        })
    })
}

function mudarCapituloAtualComBotao(){
    const seletoresCapitulos = document.querySelectorAll('.select-cap-atual')
    const botoesCapitulo = document.querySelectorAll('.btn-cap')


    botoesCapitulo.forEach((botao, index) => {
        botao.addEventListener('click', () => {

            const select = seletoresCapitulos[parseInt(index/2)]
            let novoValor = parseInt(select.value)

            if (botao.textContent === '-') {
                novoValor = Math.max(1, novoValor - 1)
            } else {
                novoValor = Math.min(botao.dataset.capTotal, novoValor + 1)
            }

            select.value = novoValor
            select.dispatchEvent(new Event('change'))
        })
    })

}

function adicionarTitulo(){
    const btnAdicionarTitulo = document.getElementById('btn-adicionar-titulo');

    btnAdicionarTitulo.addEventListener('click', () => {
        const titulosContainer = document.querySelector('.titulos-container');
        const novoTitulo = document.createElement('input');
        novoTitulo.type = 'text';
        novoTitulo.name = 'titulos';
        novoTitulo.placeholder = 'Outro título';
        novoTitulo.required = true;
        titulosContainer.appendChild(novoTitulo);
    });
}

document.addEventListener('DOMContentLoaded', () => {

    mostrarModalAdicionarManhwa()
    mostrarModalAdicionarLink()

    mudarCapituloAtual()

    mudarCapituloAtualComBotao()

    adicionarTitulo()

});