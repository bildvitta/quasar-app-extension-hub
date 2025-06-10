<template>
  <qas-dialog v-model="model" v-bind="dialogProps">
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
defineOptions({ name: 'AppDevLoginDialog' })

const props = defineProps({
  environment: {
    default: 'development',
    type: String,
    required: true,
    validator: value => ['development', 'temporary'].includes(value)
  },

  url: {
    default: '',
    type: String
  }
})

// models
const model = defineModel({ type: Boolean })

// emits
const emit = defineEmits(['try-again'])

// consts
const environmentLabel = props.environment === 'development' ? 'desenvolvimento' : 'temporário'

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
  useForm: true,
  persistent: false
}
</script>
