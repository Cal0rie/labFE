<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'dadadadadaGit',
  data() {
    return {
      url: 'https://gitee.com/dadadadada/dadadadada-Vue'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
