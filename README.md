# TechShare

**TechShare** é um projeto integrador desenvolvido como parte do curso Técnico em Desenvolvimento de Sistemas.  
O objetivo principal é aplicar na prática os conhecimentos adquiridos ao longo do curso, abrangendo desde o planejamento até a implementação de uma aplicação web funcional.

## 📚 Sobre o Projeto

Este projeto visa proporcionar uma plataforma de compartilhamento de tecnologia, onde os usuários podem:

- Cadastrar e gerenciar conteúdos relacionados a tecnologia;
- Interagir com outros usuários por meio de comentários e avaliações;
- Buscar e filtrar conteúdos por categorias ou palavras-chave.

A aplicação foi desenvolvida com foco na usabilidade, segurança e escalabilidade, seguindo as melhores práticas de desenvolvimento de software.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias e ferramentas:

### Frontend

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

### Backend

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeORM](https://typeorm.io/)
- [MySQL](https://www.mysql.com/)
- [JWT](https://jwt.io/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [dotenv](https://github.com/motdotla/dotenv)

### Outras Ferramentas

- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/)


## 📁 Estrutura do Projeto

```bash
TechShare/
├── src/
│   ├── backend/           # Código do servidor (API REST)
│   └── frontend/          # Código do cliente (interface web)
├── docsAuxiliares/
├── .env
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
└── vite.config.ts

```
---
# 1. Clone o repositório
git clone https://github.com/marcelodecarli/TechShare.git

# 2. Acesse o diretório do projeto
cd TechShare

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente conforme necessário
### Endereço do banco de dados (ex: localhost ou IP do servidor)
- DB_HOST=localhost
### Porta do banco de dados (padrão do MySQL é 3306)
- DB_PORT=3306                
### Usuário do banco de dados
- DB_USER=root               
### Senha do banco de dados
- DB_PASSWORD=sua_senha 
### Nome do banco de dados      
- DB_NAME=techshare_db   
### Chave secreta para geração de tokens JWT     
- JWT_SECRET=sua_chave_jwt    

⚠️ Atenção: Nunca compartilhe o conteúdo do seu `.env` publicamente. Esse arquivo deve ser incluído no `.gitignore`.


# Exemplo de um arquivo `.env` caso você utilize MySQL.

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=techshare_db
JWT_SECRET=sua_chave_ultra_secreta
```
---
# 5. Inicie o servidor de desenvolvimento
npm run dev
---
A aplicação estará disponível em http://localhost:3000.

✅ Funcionalidades Implementadas
Autenticação e autorização de usuários

CRUD (Create, Read, Update, Delete) de conteúdos

Sistema de comentários e avaliações

Busca e filtragem de conteúdos

Responsividade para dispositivos móveis

📄 Licença
Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para mais informações.