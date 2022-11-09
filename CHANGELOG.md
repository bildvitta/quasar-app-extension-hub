# Changelog
Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.
O formato é baseado em Keep a Changelog, e este projeto adere ao Semantic Versioning.

## Não publicado
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
