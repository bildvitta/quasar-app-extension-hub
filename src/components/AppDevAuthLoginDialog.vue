<template>
  <div>
    OUSH
    <div class="full-width">
      <q-input v-model="accessToken" label="Meu input!" />
    </div>
  </div>
  <!-- <qas-dialog model-value v-bind="dialogProps">
    <template #description>
    </template>
  </qas-dialog> -->
</template>

<script>
import { QasInput } from 'asteroid'
import { QInput } from 'quasar'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppDevAuthLoginDialog',

  components: {
    QInput
  },

  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      accessToken: ''
    }
  },

  computed: {
    dialogProps() {
      return {
        card: {
          title: 'Configuração de token de acesso',
        },

        cancel: false,

        ok: {
          label: 'Setar token',
        },

        useForm: true
      }
    }
  }
})
</script>

<!-- <script setup>
import { onMounted, ref } from 'vue';

defineOptions({ name: 'AppDevAuthLoginDialog' })

// refs
const accessToken = ref('')

const dialogProps = {
  card: {
    title: 'Configuração de token de acesso',
  },

  cancel: false,

  ok: {
    label: 'Setar token',
  },

  useForm: true
}

onMounted(() => {
  console.log('FUI MONTADO')
})
</script> -->
