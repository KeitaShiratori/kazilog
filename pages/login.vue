<template>
  <div>
    <Alert ref="alert" alertType="error" :message="alertMessage"></Alert>
    <v-form ref="form" v-model="valid" lazy-validation>
      <!-- $touch: $dirtyフラグを trueにする -->
      <v-text-field
        v-model="username"
        :rules="usernameRules"
        label="Username"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="usernameRules"
        label="Password"
        required
        type="password"
      ></v-text-field>
      <v-btn class="mr-4" @click="submit">submit</v-btn>
      <v-btn @click="clear">clear</v-btn>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Alert from '@/components/Alert.vue'
import Auth from '~/plugins/authCookie'
import { mapGetters, mapActions } from 'vuex'

interface LoginData {
  valid: boolean
  username: string
  password: string
  alertMessage: string
  usernameRules: ((v: string) => boolean | string)[]
  passwordRules: ((v: string) => boolean | string)[]
}

export default Vue.extend({
  components: {
    Alert: Alert,
  },

  data(): LoginData {
    return {
      valid: true,
      username: '',
      password: '',
      alertMessage: '',
      usernameRules: [
        // usernameのバリデーションルール
        (v: string): boolean | string => {
          return !!v || 'Username is required'
        },
      ],
      passwordRules: [
        // passwordのバリデーションルール
        (v: string): boolean | string => {
          return !!v || 'Password is required'
        },
      ],
    }
  },

  methods: {
    ...mapActions('auth', ['firebaseAuthLogin']),
    async submit() {
      // すべてのフォームのバリデーションチェックを行う
      // validate()を呼び出すには$refs.formはHTMLFormElementにキャストしないといけない
      let success = (this.$refs.form as HTMLFormElement).validate()
      if (success) {
        const loginInfo = {
          loginMailAddress: this.$data.username,
          loginPassword: this.$data.password,
        }
        try {
          const token = await this.firebaseAuthLogin(loginInfo)
          Auth.setAccessToken(this.$cookies, token) // AuthプラグインでtokenをCookieに保存
          this.$router.push('/')
        } catch (e) {
          // 失敗時はAlertを表示
          this.$data.alertMessage = e.response?.data?.detail ?? 'Error...'
          ;(this.$refs.alert as any).open()
        }

        // ひとつ前のページに戻る: https://router.vuejs.org/guide/essentials/navigation.html
        // this.$router.back()
        // let form = new FormData()
        // form.append('username', this.$data.username)
        // form.append('password', this.$data.password)
        // this.$axios
        //   .post('//127.0.0.1:8000/api/v1/token', form)
        //   .then((res) => {
        //     let token = res.data.access_token
        //     Auth.login(this.$cookies, token) // AuthプラグインでtokenをCookieに保存
        //     // ひとつ前のページに戻る: https://router.vuejs.org/guide/essentials/navigation.html
        //     this.$router.back()
        //   })
        //   .catch((e) => {
        //     // 失敗時はAlertを表示
        //     this.$data.alertMessage = e.response?.data?.detail ?? 'Error...'
        //     ;(this.$refs.alert as any).open()
        //   })
      }
    },
    clear(): void {
      // 入力とバリデーションのリセット
      ;(this.$refs.form as HTMLFormElement).reset()
    },
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'currentUserInfo']),
  },
})
</script>
