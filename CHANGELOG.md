# Changelog
Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.
O formato é baseado em Keep a Changelog, e este projeto adere ao Semantic Versioning.

## [2.2.0-beta.2] - 13-08-2024
### Corrigido
- Corrigido erro na validação da chave de erros.

## [2.2.0-beta.1] - 12-08-2024
### Adicionado
- Loading quando estiver batendo a API `users/me`.

### Modificado
- Botão de "Tentar novamente" na página de `HubCallback` agora é redirecionado para a URL raiz do produto.

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
