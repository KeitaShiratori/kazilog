<template lang="pug">
div
  Alert(ref="alert", alertType="error", :message="alertMessage")
  v-form(ref="form", v-model="valid", lazy-validation)
    v-text-field(v-model="username", :rules="usernameRules", label="Username", required)
    v-text-field(v-model="password", :rules="usernameRules", label="Password", required, type="password")
    v-btn.mr-4(@click="submit") submit
    v-btn(@click="clear") clear

  v-card.mt-10
    v-card-title Googleでログインする
    v-card-text
      v-list
        v-list-item-group
          v-list-item
            v-btn(@click="google")
              v-icon mdi-google
              | &nbsp Googleログイン
    
</template>

<script lang="ts">
import Vue from 'vue'
import Alert from '@/components/Alert.vue'
import Auth from '~/plugins/authCookie'
import { mapGetters, mapActions } from 'vuex'
import QfamilyIdGql from '@/apollo/queries/familyId.gql'
import MLoginGql from '@/apollo/mutations/login.gql'
import { UserAuth } from '~/types/generated/graphql'

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
          console.log('@login#submit token: ' + token)
          Auth.setAccessToken(this.$cookies, token) // AuthプラグインでtokenをCookieに保存
          await this.createUserIfNotExist()
        } catch (e: any) {
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
    async google() {
      try {
        const token = await this.signInWithGoogle()
        console.log('@login#google token: ' + token)
        Auth.setAccessToken(this.$cookies, token) // AuthプラグインでtokenをCookieに保存
        await this.createUserIfNotExist()
        console.log('@/pages/login createUserIfNotExist end')
      } catch (e: any) {
        // 失敗時はAlertを表示
        this.$data.alertMessage = e.response?.data?.detail ?? 'Error...'
        ;(this.$refs.alert as any).open()
      }
    },
    async createUserIfNotExist() {
      console.log('@/pages/login createUserIfNotExist start')
      await this.$apollo.mutate({
        mutation: MLoginGql,
        update: (store: any, _data: { data: { login: UserAuth } }) => {
          console.log('@/pages/login update MLoginGql')
          const { uid, name, familyId } = _data.data.login

          this.setFamilyId(familyId)
          console.log(
            '@/pages/login createUserIfNotExist update familyId end: familyId is ',
            familyId
          )
          if (!name || !familyId) {
            this.$router.push('/settings')
          } else {
            this.$router.push('/')
          }
        },
      })
      console.log('@/pages/login createUserIfNotExist end')
    },
    ...mapActions('auth', [
      'firebaseAuthLogin',
      'signInWithGoogle',
      'setFamilyId',
    ]),
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'currentUserInfo']),
  },
})
</script>
