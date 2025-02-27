# Quasar App Extension Hub

Adiciona integração com o Hub de autenticação. Compatível com quasar v1 quasar v2.

Para fazer o controle de estado da aplicação, esta extensão aceita `pinia` e `vuex`, dependendo de qual versão do quasar estiver utilizando:

- Quasar v1:
  - [] pinia ❌
  - [x] vuex ✅
- Quasar v2:
  - [x] pinia ✅
  - [x] vuex ✅

## Instalação

Entre no diretório do seu projeto Quasar e execute o comando:

```bash
$ quasar ext add @bildvitta/hub
```

Após isto, será gerado um arquivo `hub.config.js` com a seguinte configuração:

```js
module.exports = {
  hasAsteroid: true, // usado caso tenha extensão @bildvitta/asteroid instalada na aplicação
  forbiddenRouteName: 'Forbidden', // usado para definir o nome da rota da pagina de erro 404 (Forbidden)
  storeAdapter: 'vuex' // usado para definir qual store esta utilizando na aplicação "vuex" ou "pinia"
}
```

Lembrando que este arquivo não é obrigatório sendo possível utilizar somente para alterar configurações especificas como por exemplo usar apenas para alterar o `storeAdapter`.

**Variáveis de ambiente:**

| Nome           | Tipo                                   | Obrigatório |
|-------------   |-------------------------------------   |-------------|
| `ME_VERSION`   | `1\|2`                                 | Sim         |
| `ENVIRONMENT`  | `production\|development\|temporary`   | Sim         |

### Dica
O path `'hub'` quando utilizado para importação `import { ... } from 'hub/vuex'` ou `import { ... } from 'hub/pinia'` é criado via alias, então é perdido todo o autocomplete/intellisense do vscode, para contornar isto, dentro do `jsconfig.json`, adicione:

**pinia:**
```json
"compilerOptions": {
  "baseUrl": ".",
  "paths": {
    "hub/pinia": ["node_modules/@bildvitta/quasar-app-extension-hub/src/globals/pinia/index.js"]
  }
}
```

**vuex:**
```json
"compilerOptions": {
  "baseUrl": ".",
  "paths": {
    "hub/vuex": ["node_modules/@bildvitta/quasar-app-extension-hub/src/globals/vuex/index.js"]
  }
}
```

Pronto, agora ao importar vai aparecer todas possíveis opções a serem importadas, e o JSDOC irá funcionar.

## Usando com Vuex
Por padrão a store de controle de estado é utilizando vuex, como estamos dando compatibilidade tanto para pinia quando para vuex, não existem `mutations` dentro da nossa store, uma vez que mutations não existem no `pinia`, por conta disto quando utilizar vuex é necessário desativar o modo `strict`, caso contrario vai aparecer vários erros de alteração de `state` fora de `mutations`, entre no `index.js` do `store` e desabilite, por exemplo:

```js
export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      // example
    },

    strict: false // Aqui desativamos o strict!!!
  })

  return Store
})
```

Pronto, agora podemos utilizar nossa extensão com `vuex`.

Usando store do vuex:
```js
import { mapState } from 'vuex'

...mapState('hub', ['user', 'accessToken'])

// ou

// esta forma de utilizar é a MENOS recomendada
this.$store.state.hub.user
this.$store.state.hub.accessToken
```

## Usando com Pinia
Caso não exista o arquivo `hub.config.js`, crie um na raiz da aplicação e adicione a seguinte configuração:

```js
// hub.config.js
module.exports = {
  storeAdapter: 'pinia'
}
```

Usando store do pinia:
```js
import { hubStore } from 'hub/pinia'

const hub = hubStore()

hub.user // retorna o usuário caso exista
hub.accessToken // retorna o accessToken caso existe, e assim por diante...

// ou

// esta forma de utilizar é a MENOS recomendada
this.$piniaStore.hub.user
this.$piniaStore.hub.accessToken
```

Para mais detalhes de como utilizar uma store do Pinia, clique [aqui](https://pinia.vuejs.org/).

## Estrutura da store (pinia ou vuex)
A store gerada contém a seguinte estrutura abaixo, independente se utilizar pinia ou vuex:

### State
- accessToken
- user

### Getters
- hasAccessToken
- hasUser
- userPermissions

### Actions
- clear
- callback
- getUser
- login
- logout
- refresh
- getUserMeURL
- setAccessToken

## Validação das rotas

Para a validação das rotas, será necessário adicionar no objeto correspondente a rota o seguinte trecho de código: `meta: { requiresAuth: true }`.

Ele poderá ser adicionado diretamente na raiz, assim atribuindo a validação nas rotas filhas.

## Endpoints

Esta extensão comunica-se apenas com a aplicação servidor diretamente ligada ao projeto, que deve possuir os seguintes _endpoints_:

| Endpoint | Método | Parâmetros | Retorno | Descrição |
|----------|--------|------------|---------|-----------|
| `/users/me?version={process.env.ME_VERSION}` | `GET` | | `{ user: { ... } }` | Busca os dados do usuário autenticado. |
| `/auth/callback` | `GET` | `code` e `state`: Chaves do Hub. | `{ accessToken: '...' }` | Irá retornar o JWT. |
| `/auth/login` | `GET` | `url`: Endereço de _callback_. | `{ loginUrl: '...' }` | Busca o endereço de autenticação. |
| `/auth/logout` | `GET` | `url`: Endereço de _callback_. | `{ logoutUrl: '...' }` | Busca o endereço de desconexão. |
| `/auth/refresh` | `GET` | | `{ accessToken: '...' }` | Irá retornar um novo JWT. |

## Eventos

É possível solicitar o `accessToken` e `user` através do [window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) (muito útil para utilizar com PWA).

- solicitar `accessToken` na aplicação:
  ```js
  // aqui você solicita o accessToken
  window.postMessage({ type: 'requestAccessToken' })

  // aqui você recebe a solicitação do accessToken
  window.addEventListener('message', ({ data }) => {
    data.type // responseAccessToken
    data.accessToken // accessToken atual
  })
  ```

- solicitar `user` na aplicação:
  ```js
  // aqui você solicita o user
  window.postMessage({ type: 'requestUser' })

  // aqui você recebe a solicitação do user
  window.addEventListener('message', ({ data }) => {
    data.type // responseUser
    data.user // user atual
  })
  ```

- Evento que retorna toda vez que o `user` é atualizado (users/me):
  ```js
  
  window.addEventListener('message', ({ data }) => {
    data.type // updateUser
    data.user // user atualizado
  })
  ```

- Evento que retorna toda vez que o `accessToken` é atualizado:
  ```js
  window.addEventListener('message', ({ data }) => {
    data.type // updateAccessToken
    data.accessToken // token atualizado
  })
  ```

## Composables
É possível importar o composable `useCan` e `useAppCan` para utilizar com Composition API, existem 2 opções, para o pinia e para o vuex:

```js
import { useCan, useAppCan } from 'hub/vuex'

const { can, canAny } = useCan()

const {
  can,
  canList,
  canCreate,
  canByPermission,
  canEdit,
  canDelete,
  canShow
} = useAppCan()
```

```js
import { useCan } from 'hub/pinia'

const { can, canAny, useAppCan } = useCan()

const {
  can,
  canList,
  canCreate,
  canByPermission,
  canEdit,
  canDelete,
  canShow
} = useAppCan()
```

## Funções globais

Esta extensão também verifica se o usuário possui ou não permissões para visualizar o conteúdo com a função `$can`
A função verifica no retorno do usuário logado, se ele possui ou não privilégios atrelados à chamada do `/me` salvo na storage

`$can('permissionName.permissionAction', 'id')`

`permissionName` = Nome da permissão em questão
`permissionAction` = Ação da permissão
`id` = Chave única da entidade (não obrigatório), necessário quando existe a verificação de um item especifico

ex.: `$can('realState.create')` -> Verifica se o usuário possui permissões de criação de empreendimento
ex. 2: `$can('realState.show`, realStateId)` -> Verifica se o usuário possui permissão para ver o empreendimento de id `realStateId`

Obs.: Caso o usuário tenha permissões de verificar `todas as entidades`, ele terá um wildcard `*`.
Obs. 2: Essa função também verifica se o usuário é superuser, caso positivo, ira retornar sempre `true`

**Observação importante:**
Não existe uma função global para o composable `useAppCan`, para isto, quando utilizado em options api, continue utilizando o composable, exemplo:
```js
import { useAppCan } from 'hub/vuex'

export default {
  name: 'XPTO',

  data () {
    permission: useAppCan()
  },

  created () {
    ...

    if (this.permission.canList('xpto')) ...
  }
}
```

## Contribuindo

Com este repositório em sua máquina, basta instalar a extensão apontando o diretório local de dentro de uma aplicação Quasar, por exemplo:

```bash
$ npm i -D file://../quasar-app-extension-hub
```

Ainda que dispensável para esta extensão, você pode invocar o arquivo de instalação executando o comando:

```bash
$ quasar ext invoke @bildvitta/hub
```
