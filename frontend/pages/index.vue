<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        Seacrh for a secret
      </h1>
      <input v-model="secretHash" placeholder="hash"/>
      <div class="links">
        <a href="/create-secret" target="_blank" class="button--green">
          Create a secret
        </a>
        <button v-on:click="search" class="button--grey">Seach</button>
      </div>
      <div v-if="secret" class="secret-content">
        <div>hash: {{secret.hash}},</div>
        <div>secretText: {{secret.secretText}},</div>
        <div>createdAt: {{secret.createdAt}},</div>
        <div>expiresAt: {{secret.expiresAt}},</div>
        <div>remainingViews:{{secret.remainingViews}}</div>
      </div>
      <div class="secret-content" v-else>
        {{secretMsg}}
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  methods: {
    search: function () {
      if (this.secretHash.length == 0) return
      this.$axios.$get(`/api/secret/${this.secretHash}`)
        .then((res) => {
          if (res.hash) {
            this.secret = res
          }
        })
        .catch(() => {
          this.secret = null
          this.secretMsg = "Not found"
        })
    },
  },
  data: () => {
    return { 
      secret: null,
      secretMsg: 'You will see the secret here if the hash is correct',
      secretHash: ''
    }
  }
}
</script>

<style>
.secret-content {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-size: 15px;
  color: #3f495f;
  letter-spacing: 1px;
  padding-top: 50px;
}

input {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
