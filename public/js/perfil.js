class ProfileManager {
    constructor() {
        this.userId = null;
        this.initElements();
        this.initEventListeners();
        this.loadUserProfile();
    }

    initElements() {
        this.elements = {
            userName: document.getElementById('userName'),
            userEmail: document.getElementById('userEmail'),
            userPhone: document.getElementById('userPhone'),
            userBirthDate: document.getElementById('userBirthDate'),
            btnEditProfile: document.getElementById('btnEditProfile'),
            btnDeleteAccount: document.getElementById('btnDeleteAccount'),
            editForm: document.getElementById('editForm'),
            profileForm: document.getElementById('profileForm'),
            editName: document.getElementById('editName'),
            editEmail: document.getElementById('editEmail'),
            editPhone: document.getElementById('editPhone'),
            editBirthDate: document.getElementById('editBirthDate'),
            editPassword: document.getElementById('editPassword'),
            btnCancelEdit: document.getElementById('btnCancelEdit'),
            confirmDeleteModal: document.getElementById('confirmDeleteModal'),
            confirmPassword: document.getElementById('confirmPassword'),
            btnConfirmDelete: document.getElementById('btnConfirmDelete'),
            passwordError: document.getElementById('passwordError'),
            btnSair: document.getElementById('btnSair'),
            availableItems: document.getElementById('availableItems'),
            donatedItems: document.getElementById('donatedItems')
        };
    }

    initEventListeners() {
        this.elements.btnEditProfile.addEventListener('click', () => this.toggleEditForm());
        this.elements.btnCancelEdit.addEventListener('click', () => this.toggleEditForm(false));
        this.elements.profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        this.elements.btnDeleteAccount.addEventListener('click', () => this.showDeleteModal());
        this.elements.btnConfirmDelete.addEventListener('click', () => this.handleAccountDeletion());
        this.elements.btnSair.addEventListener('click', () => this.handleLogout());
    }

    async loadUserProfile() {
        try {
            const response = await fetch('/api/users/me', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar perfil');
            }

            const userData = await response.json();
            this.userId = userData.id;
            this.displayUserData(userData);
            await this.loadUserItems();
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            alert('Erro ao carregar perfil. Por favor, tente novamente.');
            window.location.href = './login.html';
        }
    }

    displayUserData(userData) {
        this.elements.userName.textContent = userData.nome;
        this.elements.userEmail.textContent = userData.email;
        this.elements.userPhone.textContent = userData.telefone;
        
        const birthDate = new Date(userData.dataNascimento);
        this.elements.userBirthDate.textContent = birthDate.toLocaleDateString('pt-BR');

        // Preenche o formulário de edição
        this.elements.editName.value = userData.nome;
        this.elements.editEmail.value = userData.email;
        this.elements.editPhone.value = userData.telefone;
        this.elements.editBirthDate.value = userData.dataNascimento.split('T')[0];
    }

    async loadUserItems() {
        try {
            // Implemente esta função conforme sua API de itens
            // Exemplo:
            // const response = await fetch(`/api/users/${this.userId}/items`);
            // const items = await response.json();
            // this.displayItems(items);
            
            // Placeholder para demonstração
            this.displayItems([], 'availableItems');
            this.displayItems([], 'donatedItems');
        } catch (error) {
            console.error('Erro ao carregar itens:', error);
        }
    }

    displayItems(items, containerId) {
        const container = this.elements[containerId];
        container.innerHTML = '';

        if (items.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-4">
                    <p class="text-muted">${containerId === 'availableItems' ? 
                        'Nenhum item disponível no momento.' : 'Nenhum item doado ainda.'}</p>
                </div>
            `;
            return;
        }

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'col-md-4 mb-3';
            itemElement.innerHTML = `
                <div class="card h-100">
                    <img src="${item.imagem || './assets/default-item.jpg'}" class="card-img-top" alt="${item.nome}">
                    <div class="card-body">
                        <h5 class="card-title">${item.nome}</h5>
                        <p class="card-text">${item.descricao || 'Sem descrição'}</p>
                        <button class="btn btn-danger btn-sm delete-item" data-id="${item.id}">
                            <i class="bi bi-trash"></i> Excluir
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(itemElement);
        });

        // Adiciona event listeners para os botões de exclusão
        document.querySelectorAll('.delete-item').forEach(button => {
            button.addEventListener('click', (e) => this.handleDeleteItem(e));
        });
    }

    toggleEditForm(show = true) {
        this.elements.editForm.classList.toggle('hidden', !show);
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        
        try {
            const formData = {
                nome: this.elements.editName.value,
                email: this.elements.editEmail.value,
                telefone: this.elements.editPhone.value,
                dataNascimento: this.elements.editBirthDate.value,
                senha: this.elements.editPassword.value || undefined
            };

            const response = await fetch(`/api/users/${this.userId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar perfil');
            }

            const updatedUser = await response.json();
            this.displayUserData(updatedUser);
            this.toggleEditForm(false);
            this.elements.editPassword.value = '';
            
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil: ' + error.message);
        }
    }

    showDeleteModal() {
        const modal = new bootstrap.Modal(this.elements.confirmDeleteModal);
        this.elements.confirmPassword.value = '';
        this.elements.passwordError.classList.add('d-none');
        modal.show();
    }

    async handleAccountDeletion() {
        const password = this.elements.confirmPassword.value;
        
        if (!password) {
            this.elements.passwordError.textContent = 'Por favor, digite sua senha';
            this.elements.passwordError.classList.remove('d-none');
            return;
        }

        try {
            // Primeiro verifica a senha
            const verifyResponse = await fetch('/api/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.elements.userEmail.textContent,
                    senha: password
                })
            });

            if (!verifyResponse.ok) {
                throw new Error('Senha incorreta');
            }

            // Se a senha estiver correta, procede com a exclusão
            const deleteResponse = await fetch(`/api/users/${this.userId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!deleteResponse.ok) {
                throw new Error('Erro ao excluir conta');
            }

            // Faz logout
            await this.handleLogout();
            
            alert('Conta excluída com sucesso.');
            window.location.href = './index.html';
        } catch (error) {
            console.error('Erro ao excluir conta:', error);
            this.elements.passwordError.textContent = error.message;
            this.elements.passwordError.classList.remove('d-none');
        }
    }

    async handleLogout() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                window.location.href = './login.html';
            } else {
                throw new Error('Erro ao fazer logout');
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            alert('Erro ao fazer logout. Por favor, tente novamente.');
        }
    }

    handleDeleteItem(e) {
        const itemId = e.target.closest('button').dataset.id;
        if (!confirm('Tem certeza que deseja excluir este item?')) return;

        // Implemente a chamada para excluir o item
        console.log('Excluir item:', itemId);
        // fetch(`/api/items/${itemId}`, { method: 'DELETE' })
        //     .then(...)
    }
}

// Inicializa o gerenciador de perfil quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});