<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'dadadadadaDoc',
  data() {
    return {
      url: 'http://doc.dadadadada.vip/dadadadada-vue'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
