
function showToast(message, type = 'info') {
    // Procura pelo contêiner de toasts. Se não existir, cria um.
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Cria o elemento da notificação
    const toast = document.createElement('div');
    toast.className = `toast ${type}`; // Ex: 'toast success'
    toast.textContent = message;

    // Adiciona a notificação ao contêiner
    container.appendChild(toast);

    function removeToast() {
        toast.remove();
    }

    // Remove a notificação após a animação CSS terminar (4 segundos)
    const timeoutId = setTimeout(removeToast, 4000);

    // Retorna handler para controle externo
    return {
        remove: () => {
            clearTimeout(timeoutId);
            removeToast();
        },
        toastElement: toast // opcional, para manipular diretamente o elemento
    };
}