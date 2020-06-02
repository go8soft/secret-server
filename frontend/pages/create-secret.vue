<template>
  <div class="container">
    <div>
      <h1 class="title">
        Create a secret
      </h1>
      <form @submit="checkForm" action="" method="post" novalidate="true">
        <div class="input-container">
          <input v-model="secret.secret" placeholder="secret"/>
        </div>
        <div class="input-container">
          <input v-model="secret.expireAfterViews" placeholder="expireAfterViews" type="number" min="0"/>
        </div>
        <div class="input-container">
          <input v-model="secret.expireAfter" placeholder="expireAfter" type="number" min="0"/>
        </div>
        <div v-if="errors.length" class="input-container">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </div>
        <div v-if="msg" class="input-container">
          {{ msg }}
        </div>
        <div v-if="secret && isSuccess" class="input-content">
          <div>hash: {{secret.hash}},</div>
          <div>secretText: {{secret.secretText}},</div>
          <div>createdAt: {{secret.createdAt}},</div>
          <div>expiresAt: {{secret.expiresAt}},</div>
          <div>remainingViews:{{secret.remainingViews}}</div>
        </div>
        <div class="links">
          <button class="button--grey" type="submit">Create</button>
          <a href="/" target="_blank" class="button--green">
            Search for a secret
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    create: function () {
      this.$axios.$post('/api/secret', {
          secret: this.secret.secret,
          expireAfterViews: this.secret.expireAfterViews,
          expireAfter: this.secret.expireAfter
      }).then((res) => {
        if (res.hash) {
          this.msg = "The secret was created"
          this.secret = res
          this.isSuccess = true
        }
      }).catch(() => {
        this.secret = {}
        this.msg = "Can not create the secret"
      })
    },
    checkForm: function (e) {
      e.preventDefault()
      
      this.errors = []
      
      if (!this.secret.secret) {
        this.errors.push("Secret required.")
      }
      
      if (!this.secret.expireAfterViews) {
        this.errors.push("expireAfterViews required.")
      } else if (Number(this.secret.expireAfterViews) < 0) {
        this.errors.push("expireAfterViews should be >= 0.")
      }
      
      if (!this.secret.expireAfter) {
        this.errors.push("expireAfter required.")
      } else if (Number(this.secret.expireAfter) < 0) {
        this.errors.push("expireAfter should be >= 0.")
      }

      if (!this.errors.length) {
        this.create()
        return true
      } else {
        this.msg = null
        this.isSuccess = false
      }
    }
  },
  data: () => {
    return { 
      errors: [],
      secret: {},
      msg: null,
      isSuccess: false
    }
  }
}
</script>

<style>
  .input-container {
    padding: 15px;
  }
  input {
    font-weight: 300;
    font-size: 25px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }
</style>