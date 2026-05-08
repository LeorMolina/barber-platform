🪮 BarberPlatform API - Documentação Técnica
Esta é uma API REST desenvolvida para gestão de barbearias, focada em agendamentos, controle de profissionais e serviços.

🛠️ Tecnologias Utilizadas
NestJS: Framework Node.js progressivo para a criação de aplicativos do lado do servidor eficientes e escaláveis.

PostgreSQL: Banco de dados relacional robusto para persistência de dados.

Docker & Docker Compose: Utilizados para containerizar o banco de dados, garantindo que o ambiente seja o mesmo em qualquer máquina.

Prisma ORM: Ponte inteligente entre o código e o banco de dados, facilitando consultas e migrações.

Class-Validator & Transformer: Bibliotecas para garantir que os dados que entram na API sejam válidos e seguros.

🏗️ Arquitetura do Sistema
O projeto segue a arquitetura modular do NestJS, onde cada entidade possui sua própria pasta com:

Module: Onde as peças são conectadas.

Controller: Onde as rotas (URLs) são definidas.

Service: Onde a inteligência e as regras de negócio moram.

DTO (Data Transfer Object): Onde definimos o formato dos dados que a API aceita.

Entidades Criadas:
Barbers: Cadastro de profissionais.

Clients: Gestão de clientes.

Services: Catálogo de serviços (preço e duração).

Appointments: O motor de agendamentos que cruza todas as informações.

🔒 Regras de Negócio Implementadas
Diferente de um simples cadastro, nosso módulo de Agendamentos possui travas de segurança:

Validação de Data: Não é permitido realizar agendamentos em datas ou horários que já passaram.

Prevenção de Overbooking: O sistema verifica no banco de dados se o barbeiro escolhido já possui um cliente marcado naquele exato horário, impedindo conflitos na agenda.

🚀 Como Rodar o Projeto
1. Banco de Dados (Docker)
Subir o container do PostgreSQL: Bash
                                    docker-compose up -d

2. Sincronização com o Prisma
Gerar as tabelas no banco de dados: Bash
                                    npx prisma migrate dev

3. Iniciar o Servidor: Bash
                        npm run start:dev

Método,         Rota,               Descrição
POST,           /barbers,           Cadastra um novo barbeiro
GET,            /barbers,           Lista todos os barbeiros
POST,           /appointments,      Cria um novo agendamento com validação
GET,            /appointments,      Lista a agenda completa

