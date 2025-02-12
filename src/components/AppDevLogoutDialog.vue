<template>
  <qas-dialog v-bind="dialogProps">
    <template #description>
      Você não esta logado no ambiente de <strong>{{ environmentLabel }}</strong>.
      Para fazer login automático, siga os passos abaixo:

      <ol class="q-px-md">
        <li>Entre no ambiente de {{ environmentLabel }} e faça login manualmente.</li>

        <li>Após fazer login, volte para esta tela e tente novamente o login automático.</li>
      </ol>
    </template>
  </qas-dialog>
</template>

<script setup>
defineOptions({ name: 'AppDevLogoutDialog' })

const props = defineProps({
  environment: {
    default: 'dev',
    type: String,
    required: true,
    validator: value => ['dev', 'temp'].includes(value)
  },

  url: {
    default: 'http://localhost:8080',
    type: String
  }
})

const emit = defineEmits(['try-again'])

// consts
const environmentLabel = props.environment === 'dev' ? 'desenvolvimento' : 'temporário'

const dialogProps = {
  card: {
    title: 'Login automático não disponível'
  },

  ok: {
    label: `Acessar ${environmentLabel}`,
    onClick: () => window.open(props.url, '_blank')
  },

  cancel: {
    label: 'Tentar novamente',
    onClick: () => emit('try-again')
  },

  maxWidth: '650px',
  useFullMaxWidth: true,
  persistent: false
}
</script>
