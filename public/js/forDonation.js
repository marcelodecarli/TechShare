let donations = [];

// Função para atualizar a lista de doações exibida
function updateDonationList() {
    const donationListElement = document.getElementById('donationList');
    donationListElement.innerHTML = ''; 

    donations.forEach((donation, index) => {
        const donationDiv = document.createElement('div');
        donationDiv.classList.add('card', 'mb-3');
        donationDiv.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${donation.name}</h5>
                <p class="card-text">${donation.description}</p>
                <p><strong>Estado:</strong> ${donation.state}</p>
                <button class="btn btn-warning" onclick="editDonation(${index})">Editar</button>
                <button class="btn btn-danger" onclick="deleteDonation(${index})">Deletar</button>
            </div>
        `;
        donationListElement.appendChild(donationDiv);
    });
}

// Função para adicionar uma nova doação
document.getElementById('donationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('itemName').value;
    const description = document.getElementById('itemDescription').value;
    const state = document.getElementById('itemState').value;

    donations.push({ name, description, state });
    updateDonationList();

    // Limpar o formulário
    document.getElementById('donationForm').reset();
});

// Função para editar uma doação existente
function editDonation(index) {
    const donation = donations[index];

    document.getElementById('itemName').value = donation.name;
    document.getElementById('itemDescription').value = donation.description;
    document.getElementById('itemState').value = donation.state;

    // Alterar o botão de envio para atualizar a doação
    const donationForm = document.getElementById('donationForm');
    donationForm.removeEventListener('submit', addDonationHandler);
    donationForm.addEventListener('submit', function updateDonationHandler(event) {
        event.preventDefault();

        donations[index] = {
            name: document.getElementById('itemName').value,
            description: document.getElementById('itemDescription').value,
            state: document.getElementById('itemState').value,
        };

        updateDonationList();
        donationForm.reset();

        // Revertendo para a ação de adicionar nova doação
        donationForm.removeEventListener('submit', updateDonationHandler);
        donationForm.addEventListener('submit', addDonationHandler);
    });
}

// Função para deletar uma doação
function deleteDonation(index) {
    donations.splice(index, 1);
    updateDonationList();
}

// Função para adicionar nova doação (inicial)
function addDonationHandler(event) {
    event.preventDefault();

    const name = document.getElementById('itemName').value;
    const description = document.getElementById('itemDescription').value;
    const state = document.getElementById('itemState').value;

    donations.push({ name, description, state });
    updateDonationList();

    // Limpar o formulário
    document.getElementById('donationForm').reset();
}
