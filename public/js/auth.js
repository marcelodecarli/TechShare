export async function authenticateToken() {
    try {
        const response = await fetch('http://localhost:3000/api/users/me', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na autenticação:', error);
        return null;
    }
}

export async function getCurrentUser() {
    try {
        const response = await fetch('http://localhost:3000/api/users/me', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao obter usuário atual:', error);
        return null;
    }
}