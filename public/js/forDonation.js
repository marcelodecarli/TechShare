document.addEventListener("DOMContentLoaded", async () => {
    const itemsContainer = document.querySelector(".row");
    
    // Função para formatar o estado (ex: "rs" → "RS")
    const formatEstado = (estado) => {
        const estados = {
            'ac': 'Acre', 'al': 'Alagoas', 'ap': 'Amapá', 'am': 'Amazonas',
            'ba': 'Bahia', 'ce': 'Ceará', 'df': 'Distrito Federal',
            'es': 'Espírito Santo', 'go': 'Goiás', 'ma': 'Maranhão',
            'mt': 'Mato Grosso', 'ms': 'Mato Grosso do Sul', 'mg': 'Minas Gerais',
            'pa': 'Pará', 'pb': 'Paraíba', 'pr': 'Paraná', 'pe': 'Pernambuco',
            'pi': 'Piauí', 'rj': 'Rio de Janeiro', 'rn': 'Rio Grande do Norte',
            'rs': 'Rio Grande do Sul', 'ro': 'Rondônia', 'rr': 'Roraima',
            'sc': 'Santa Catarina', 'sp': 'São Paulo', 'se': 'Sergipe',
            'to': 'Tocantins'
        };
        return estados[estado.toLowerCase()] || estado.toUpperCase();
    };

    // Busca os pedidos da API
    const fetchPedidos = async () => {
        try {
            const response = await fetch("/api/pedidos", {
                credentials: "include"
            });
            
            if (!response.ok) {
                throw new Error("Erro ao carregar pedidos");
            }
            
            return await response.json();
        } catch (error) {
            console.error("Erro:", error);
            alert("Falha ao carregar itens: " + error.message);
            return [];
        }
    };

    // Renderiza os pedidos na página
    const renderPedidos = async () => {
        const pedidos = await fetchPedidos();
        itemsContainer.innerHTML = '';

        pedidos.forEach((pedido) => {
            const modalId = `pedidoModal${pedido.id}`;
            
            // Cria o card
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card h-100">
                    ${pedido.comprovanteEscolar ? 
                        `<img src="/uploads/${pedido.comprovanteEscolar}" class="card-img-top" alt="${pedido.tipoEletronico}">` : 
                        `<div class="card-img-top bg-secondary" style="height: 200px;"></div>`
                    }
                    <div class="card-body">
                        <h5 class="card-title">${pedido.tipoEletronico}</h5>
                        <p class="card-text">Estado: ${pedido.nivelNecessidade}</p>
                        <p class="card-text"><small>${pedido.cidade}, ${formatEstado(pedido.estado)}</small></p>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${modalId}">
                            Mais Informações
                        </button>
                    </div>
                </div>
            `;
            
            // Cria o modal correspondente
            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = modalId;
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('aria-hidden', 'true');
            modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header" style="background-color: #010d17;">
                            <h5 class="modal-title text-white">${pedido.tipoEletronico}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" style="background-color: #010d17;">
                            ${pedido.comprovanteEscolar ? 
                                `<img src="/uploads/${pedido.comprovanteEscolar}" class="img-fluid mb-3" alt="${pedido.tipoEletronico}">` : 
                                ''
                            }
                            <p class="text-white">
                                <strong>Estado do item:</strong> ${pedido.nivelNecessidade}<br>
                                <strong>Localização:</strong> ${pedido.cidade}, ${formatEstado(pedido.estado)}<br><br>
                                <strong>Contato:</strong> 51 99999-9999<br>
                                <strong>Email:</strong> contato@techshare.com
                            </p>
                        </div>
                        <div class="modal-footer" style="background-color: #010d17;">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Adiciona à página
            itemsContainer.appendChild(card);
            document.body.appendChild(modal);
        });
    };

    // Inicializa
    await renderPedidos();
});