function mostrarModalAdicionarManhwa(){
    const btnAbrirModal1 = document.getElementsByClassName('btn-abrir-modal')[0];
    const btnAbrirModal2 = document.getElementsByClassName('btn-abrir-modal')[1];
    const btnFecharModal = document.getElementById('btn-fechar-modal');
    const modal = document.getElementById('modal-manhwa');

    
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
    const modalLinkAdicionar = document.querySelector('.modal-link-adicionar');
    const btnFecharModalLink = modalLinkAdicionar.querySelector('.btn-fechar-modal-link');
    
    if (btnAbrirModalLink && btnFecharModalLink && modalLinkAdicionar) {
        const abrirModalLink = () => { modalLinkAdicionar.style.display = 'flex'; };
        const fecharModalLink = () => { modalLinkAdicionar.style.display = 'none'; };

        btnAbrirModalLink.addEventListener('click', abrirModalLink);
        btnFecharModalLink.addEventListener('click', fecharModalLink);
        modalLinkAdicionar.addEventListener('click', (event) => {
            if (event.target === modalLinkAdicionar) {
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

function mostrarModalAtualizarManhwa(){
    const btnAbrirModalAtualizar = document.getElementById('btn-abrir-modal-atualizar');
    const btnFecharModalAtualizar = document.getElementById('btn-fechar-modal');
    const modalAtualizar = document.getElementById('modal-manhwa');


    btnAbrirModalAtualizar.addEventListener('click', () => {
        modalAtualizar.style.display = 'flex';
    });

    btnFecharModalAtualizar.addEventListener('click', () => {
        modalAtualizar.style.display = 'none';
    });

    modalAtualizar.addEventListener('click', (event) => {
        // Se o alvo do clique for o fundo cinza (o próprio modal-overlay)...
        if (event.target === modalAtualizar) {
            modalAtualizar.style.display = 'none';
        }
    });
}

function mostrarModalAtualizarLink() {
    const botoesAtualizarLink = document.querySelectorAll('.btn-abrir-modal-atualizar-link');
    const modalLinkAtualizar = document.querySelector('.modal-link-atualizar');
    
    if (!modalLinkAtualizar) {
        console.error("Modal de atualização de link não encontrado!");
        return;
    }
    
    const btnFecharModalLink = modalLinkAtualizar.querySelector('.btn-fechar-modal-link');
    
    if (botoesAtualizarLink && btnFecharModalLink) {
        // Função para fechar o modal
        const fecharModalLink = () => { 
            modalLinkAtualizar.style.display = 'none'; 
        };
        
        // Adicionar evento para cada botão de atualizar link
        botoesAtualizarLink.forEach(botao => {
            botao.addEventListener('click', () => {
                // Buscar os dados do link correspondente
                const linkId = botao.id;
                const linkRow = botao.closest('tr');
                
                // Obter os valores atuais da linha da tabela
                const idioma = linkRow.cells[0].textContent.trim();
                const url = linkRow.cells[1].querySelector('a').href;
                const capTotal = linkRow.cells[3].textContent.trim();
                
                // Preencher o formulário com os valores atuais
                const linkIdInput = modalLinkAtualizar.querySelector('#link-id-input');
                const idiomaSelect = modalLinkAtualizar.querySelector('#idioma');
                const urlInput = modalLinkAtualizar.querySelector('#url');
                const capTotalInput = modalLinkAtualizar.querySelector('#cap_total');
                
                if (linkIdInput && idiomaSelect && urlInput && capTotalInput) {
                    linkIdInput.value = linkId;
                    idiomaSelect.value = idioma;
                    urlInput.value = url;
                    capTotalInput.value = capTotal;
                    
                    // Exibir o modal
                    modalLinkAtualizar.style.display = 'flex';
                } else {
                    console.error("Não foi possível encontrar todos os campos no formulário");
                }
            });
        });
        
        // Fechar o modal com o botão de fechar
        btnFecharModalLink.addEventListener('click', fecharModalLink);
        
        // Fechar o modal ao clicar fora dele
        modalLinkAtualizar.addEventListener('click', (event) => {
            if (event.target === modalLinkAtualizar) {
                fecharModalLink();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {

    mostrarModalAdicionarManhwa()
    mostrarModalAdicionarLink()
    mostrarModalAtualizarLink() // Nova função para atualizar links

    mudarCapituloAtual()

    mudarCapituloAtualComBotao()

    mostrarModalAtualizarManhwa()

    adicionarTitulo()

});