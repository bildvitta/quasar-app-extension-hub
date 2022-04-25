# Quasar App Extension Hub

Adiciona integração com o Hub de autenticação.

## Endpoints

Esta extensão comunica-se apenas com a aplicação servidor diretamente ligada ao projeto, que deve possuir os seguintes _endpoints_:

| Endpoint | Método | Parâmetros | Retorno | Descrição |
|----------|--------|------------|---------|-----------|
| `/users/me` | `GET` | | `{ user: { ... } }` | Busca os dados do usuário autenticado. |
| `/auth/callback` | `GET` | `code` e `state`: Chaves do Hub. | `{ accessToken: '...' }` | Irá retornar o JWT. |
| `/auth/login` | `GET` | `url`: Endereço de _callback_. | `{ loginUrl: '...' }` | Busca o endereço de autenticação. |
| `/auth/logout` | `GET` | `url`: Endereço de _callback_. | `{ logoutUrl: '...' }` | Busca o endereço de desconexão. |
| `/auth/refresh` | `GET` | | `{ accessToken: '...' }` | Irá retornar um novo JWT. |


## Usando Vuex
Através do vuex podemos ter acesso às informações do usuário logado:

### Getters
- accessToken
- hasAccessToken
- user
- userPermissions

### Mutations

- replaceAccessToken
- replaceUser

### Actions

- clear 
- callback
- getUser
- login
- refresh
- getUserMeURL
- setAccessToken
  
## Validação das rotas

Para a validação das rotas, será necessário adicionar no objeto correspondente a rota o seguinte trecho de código: `meta: { requiresAuth: true }`.

Ele poderá ser adicionado diretamente na raiz, assim atribuindo a validação nas rotas filhas. 

## Funções

Esta extensão também verifica se o usuário possui ou não permissões para visualizar o conteúdo com a função `$can`
A função verifica no retorno do usuário logado, se ele possui ou não privilegios atrelados à chamada do `/me` salvo na storage

`$can('permissionName.permissionAction', 'id')`

`permissionName` = Nome da permissão em questão
`permissionAction` = Ação da permissão
`id` = Chave única da entidade (não obrigatório), necessário quando existe a verificação de um item especifico

ex.: `$can('realState.create')` -> Verifica se o usuário possui permissões de criação de empreendimento
ex. 2: `$can('realState.show`, realStateId)` -> Verifica se o usuário possui permissão para ver o empreendimento de id `realStateId`

Obs.: Caso o usuário tenha permissões de verificar `todas as entidades`, ele terá um wildcard `*`.
Obs. 2: Essa função também verifica se o usuário é superuser, caso positivo, ira retornar sempre `true`

## Instalação

Entre no diretório do seu projeto Quasar e execute o comando:

```bash
$ quasar ext add @bildvitta/hub
```

Simples assim.

## Contribuindo

Com este repositório em sua máquina, basta instalar a extensão apontando o diretório local de dentro de uma aplicação Quasar, por exemplo:

```bash
$ npm i -D file://../quasar-app-extension-hub
```

Ainda que dispensável para esta extensão, você pode invocar o arquivo de instalação executando o comando:

```bash
$ quasar ext invoke @bildvitta/hub  
```