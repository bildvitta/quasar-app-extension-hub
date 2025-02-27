# Changelog
Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.
O formato é baseado em Keep a Changelog, e este projeto adere ao Semantic Versioning.

## Não publicado
## BREAKING CHANGES
- Certifique-se que exista a env `ENVIRONMENT` setada com o valor `production` no ambiente de produção para não adicionar os recursos de login de desenvolvimento.
- Modificado `asteroid.config.js`.

### Adicionado
- Adicionado recurso para fazer login automático para desenvolvimento, somente disponível com o uso do `asteroid`, mediante a env `ENVIRONMENT !== 'production'`.

### Modificado
- Modificado `asteroid.config.js`..

### 3.1.1
## BREAKING CHANGES
- Modificado exportação da extensão através do alias `hub`, agora para importar o `hubStore` é através do `hub/pinia`, checar documentação do readme.md.
- Como estava vindo de forma errada o `updateUser`, é possível que na aplicação tenha que corrigir também para se adequar ao padrão correto.
- Necessário adicionar env `ME_VERSION` contendo 2 valores possíveis, `1|2`, 1 sendo o valor atual, e 2 para o novo /me.

### Adicionado
- Adicionado biblioteca `@bildvitta/composables`.
- Adicionado composables `useCan` com versões para `pinia` e `vuex`.
- Adicionado novo composable `useAppCan`.
- Adicionado arquivo `.nvmrc`.
- `store/hub/getUser`: adicionado query `version` no endpoint `GET -> users/me`, vindo da env `ME_VERSION`.
- `store/hub/mutations/replaceUser`: adicionado company default dentro de `defaultFilters` no localStorage.

### Modificado
- Modificado exportação da extensão através do alias `hub`, agora para importar o `hubStore` é através do `hub/pinia`, checar documentação do readme.md.
- Atualizado biblioteca `@bildvitta/composables` para versão `1.0.0-beta.9`.

### Corrigido
- `auth-pinia.js`: corrigido função `can` que estava sendo usada sem importação.
- Adicionado import do `postMessage` para o `updateUser` no arquivo `mutations.js`, antes estava usando postMessage nativo do `window` e estava fugindo do padrão e não retornando o `user`.
- `use-can-pinia`: adicionado `.user` no `hubStore()`, para recuperar o usuário.

## 3.1.1-beta.5 - 06-02-2025
### Adicionado
- `HubLogout`: adicionado função para limpar todo local storage e session storage.

### Corrigido
- `helpers/mutations`: corrigido função `setDefaultFiltersInStorage` que dava erro quando não existia o user a primeira vez.

## 3.1.1-beta.4 - 23-01-2025
## BREAKING CHANGES
- Necessário adicionar env `ME_VERSION` contendo 2 valores possíveis, `1|2`, 1 sendo o valor atual, e 2 para o novo /me.

### Adicionado
- Adicionado novo composable `useAppCan`.
- Adicionado arquivo `.nvmrc`.
- `store/hub/getUser`: adicionado query `version` no endpoint `GET -> users/me`, vindo da env `ME_VERSION`.
- `store/hub/mutations/replaceUser`: adicionado company default dentro de `defaultFilters` no localStorage.

### Modificado
- Atualizado biblioteca `@bildvitta/composables` para versão `1.0.0-beta.9`.

## 3.1.1-beta.3 - 15-03-2024
### Corrigido
- `use-can-pinia`: adicionado `.user` no `hubStore()`, para recuperar o usuário.

## 3.1.1-beta.2 - 15-03-2024
## BREAKING CHANGES
- Modificado exportação da extensão através do alias `hub`, agora para importar o `hubStore` é através do `hub/pinia`, checar documentação do readme.md.

### Adicionado
- Adicionado biblioteca `@bildvitta/composables`.
- Adicionado composables `useCan` com versões para `pinia` e `vuex`.

### Modificado
- Modificado exportação da extensão através do alias `hub`, agora para importar o `hubStore` é através do `hub/pinia`, checar documentação do readme.md.

## 3.1.1-beta.1 - 22-08-2023
## BREAKING CHANGES
- Como estava vindo de forma errada o `updateUser`, é possível que na aplicação tenha que corrigir também para se adequar ao padrão correto.

### Corrigido
- Adicionado import do `postMessage` para o `updateUser` no arquivo `mutations.js`, antes estava usando postMessage nativo do `window` e estava fugindo do padrão e não retornando o `user`.

## 3.1.1-beta.0 - 17-07-2023
### Corrigido
- `auth-pinia.js`: corrigido função `can` que estava sendo usada sem importação.

## 3.1.0 - 05-04-2023
### Adicionado
- `AppBtn`: adicionado componente de botão que é um wrapper do QasBtn (caso tenha asteroid) ou QBtn.
- `AppContent`: adicionado componente para conteúdo.
- `notifies`: adicionado novo helper para lidar com notifies, no momento existe apenas o de erro, já que só é usado quando existe erro.
- adicionado arquivo de configuração `hub.config.js` que é gerado automaticamente toda vez que a extensão é instalada através do comando `quasar ext add @bildvitta/hub`.

### Modificado
- [`HubLogin`, `HubLogout`, `HubRefused`, `HubCallback`, `HubMe`]: alterações de layout e comportamento.
- modificado default do storeAdapter dê `vuex` para `pinia`, agora não é preciso declarar o `storeAdapter` caso esteja usando `vuex` na aplicação.
- atualizado `README.md`;
- `auth-boot.js`: removido `notifyError` quando acontece erro `401`, já que o usuário já é redirecionado para outra pagina.
- `auth-boot.js`: removido `notifyError` quando acontece erro `403`, agora é redirecionado para uma pagina de 403.
- `auth-boot.js`: removido `notifyError` quando acontece erro `401` do `/me`.

### Corrigido
- corrigido problema com `notifyError` não estava sendo utilizado o notify do `asteroid` mesmo que a aplicação tivesse o asteroid.

### Removido
- removido helper `handleProcess` em favor de usar o arquivo do configuração `hub.config.js`.
- removido pagina `HubLoggedOut`, agora caso tenha desconectado com sucesso o usuário é enviado para tela de login do HUB.
- removido utilização da env `STORE_ADAPTER`.

## 3.1.0-beta.0 - 22-02-2023
### Adicionado
- `AppBtn`: adicionado componente de botão que é um wrapper do QasBtn (caso tenha asteroid) ou QBtn.
- `AppContent`: adicionado componente para conteúdo.
- `notifies`: adicionado novo helper para lidar com notifies, no momento existe apenas o de erro, já que só é usado quando existe erro.
- adicionado arquivo de configuração `hub.config.js` que é gerado automaticamente toda vez que a extensão é instalada através do comando `quasar ext add @bildvitta/hub`.

### Modificado
- [`HubLogin`, `HubLogout`, `HubRefused`, `HubCallback`, `HubMe`]: alterações de layout e comportamento.
- modificado default do storeAdapter dê `vuex` para `pinia`, agora não é preciso declarar o `storeAdapter` caso esteja usando `vuex` na aplicação.
- atualizado `README.md`;
- `auth-boot.js`: removido `notifyError` quando acontece erro `401`, já que o usuário já é redirecionado para outra pagina.
- `auth-boot.js`: removido `notifyError` quando acontece erro `403`, agora é redirecionado para uma pagina de 403.
- `auth-boot.js`: removido `notifyError` quando acontece erro `401` do `/me`.

### Corrigido
- corrigido problema com `notifyError` não estava sendo utilizado o notify do `asteroid` mesmo que a aplicação tivesse o asteroid.

### Removido
- removido helper `handleProcess` em favor de usar o arquivo do configuração `hub.config.js`.
- removido pagina `HubLoggedOut`, agora caso tenha desconectado com sucesso o usuário é enviado para tela de login do HUB.
- removido utilização da env `STORE_ADAPTER`.

## 3.0.0 - 03-02-2023
## BREAKING CHANGES
Por conta de adicionar compatibilidade para o `pinia` e `vuex` a forma como se utiliza a extensão foi alterada, podendo haver breaking changes, olhe o arquivo `README.md`.

### Adicionado
- Adicionado suporte para `pinia` e `vuex`.
- Adicionado loading quando acontece `getUser` sem ser vindo da pagina `auth/callback`.

### Corrigido
- Corrigido problema do `$can` adicionando callback.
- Pagina `AuthLogin` removido `isLoading` do `finally` e adicionado no `catch`.
- Repassando quasar notify de erro.
- Corrigido o titulo da página uma vez que o meta do quasar é diferente dependendo da versão, para isso, foi adicionado meta title nas rotas para controlar o título exibido.

### Modificado
- Modificado documentação do `README.md`.

### Removido
- Removido boot `can` e adicionado como `helper`.
- Removido notify de erro `403` quando estiver na página `Forbidden`.
- Removido getter `user` e `accessToken` (consegue recuperar pelo state).
- Removido mutations `replaceAccessToken` e `replaceUser` (não existe mutations no pinia).

## [3.0.0-beta.7] - 09-11-22
### Corrigido
- Repassando quasar notify de erro.

### Modificado
- Removido notify de erro `403` quando estiver na página `Forbidden`.

## [3.0.0-beta.6] - 23-08-22
### Corrigido
- Corrigido problema do `$can` adicionando callback.
- Pagina `AuthLogin` removido `isLoading` do `finally` e adicionado no `catch`.

### Removido
- Removido boot `can` e adicionado como `helper`.

## [3.0.0-beta.5] - 23-08-22
### Corrigido
- Corrigido variável global `$can` para funcionar com pinia e vuex.

### Removido
- Removido boot `can` e adicionado como `helper`.

## [3.0.0-beta.4] - 23-08-22
### Corrigido
- Alterado `??` para `||` no auth-boot para versão 1 do quasar suportar.

### Removido
- Removido variável `isLatestQuasar` não utilizado do `auth-pinia`.

## [3.0.0-beta.3] - 23-08-22
### Corrigido
- Atualizado versão do `@bildvitta/store-adapter`.

## [3.0.0-beta.2] - 23-08-22
### Corrigido
- Atualizado versão do `@bildvitta/store-adapter`.

## [3.0.0-beta.1] - 16-08-22
## BREAKING CHANGES
Por conta de adicionar compatibilidade para o `pinia` e `vuex` a forma como se utiliza a extensão foi alterada, podendo haver breaking changes, olhe o arquivo `README.md`.

### Adicionado
- Adicionado suporte para `pinia` e `vuex`.
- Adicionado loading quando acontece `getUser` sem ser vindo da pagina `auth/callback`.

### Corrigido
- Corrigido o titulo da página uma vez que o meta do quasar é diferente dependendo da versão, para isso, foi adicionado meta title nas rotas para controlar o título exibido.

### Modificado
- Modificado logica do `getUser` quando entra na aplicação.
- Modificado documentação do `README.md`.

### Removido
- Removido getter `user` e `accessToken` (consegue recuperar pelo state).
- Removido mutations `replaceAccessToken` e `replaceUser` (não existe mutations no pinia).

## [2.1.0] - 09-08-2022
Versão estável lançada.

### Adicionado
- Adicionado suporte para vue 2 com quasar 1.
- Adicionado suporte para notify sem ter `Asteroid` instalado.

## [2.1.0.beta.2] - 05-08-2022
### Corrigido
- `auth.js`: adicionado `Vue`no parâmetro.

## [2.1.0.beta.1] - 05-08-2022
### Adicionado
- Adicionado suporte para vue 2 com quasar 1.
- Adicionado suporte para notify sem ter `Asteroid` instalado.

## [2.0.0] - 04-08-2022
Versão estável lançada.

## [2.0.0-beta.1] - 11-03-2022

> :warning: Nesta versão existem **Breaking Changes** pelo fato da troca de versão do vue, porém não há **nenhuma alteração em como utilizar** esta extensão.

### Modificado
- Modificado arquivos que usam variáveis globais do vue de acordo com a versão do vue v2, agora usam de acordo com a v3.
