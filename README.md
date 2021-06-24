# Quasar App Extension Hub

Adiciona integração com o Hub de autenticação.

## Endpoints

Esta extensão comunica-se apenas com a aplicação servidor diretamente ligada ao projeto, que deve possuir os seguintes _endpoints_:

| Endpoint | Método | Parâmetros | Retorno | Descrição |
|----------|--------|------------|---------|-----------|
| `/users/me` | `GET` | | `{ user: { ... } }` | Busca os dados do usuário autenticado. |
| `/auth/login` | `GET` | `url`: Endereço de _callback_. | `{ loginUrl: '...' }` | Busca o endereço de autenticação. |
| `/auth/logout` | `GET` | `url`: Endereço de _callback_. | `{ logoutUrl: '...' }` | Busca o endereço de desconexão. |

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