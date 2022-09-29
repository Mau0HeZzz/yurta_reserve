<template>
  <v-container>
    <v-row>
      <v-col class="font-weight-bold text-uppercase" cols="12">
        Персональные данные
      </v-col>
    </v-row>
    <v-container>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="Имя"
          required
        ></v-text-field>

        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>

        <v-row class="mt-2 justify-end">
          <v-btn
            class="mr-4"
            @click="reset"
          >
            Отмена
          </v-btn>
          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate"
          >
            Сохранить
          </v-btn>
        </v-row>

      </v-form>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'UserSettings',
  metaInfo: {
    title: 'Персональные данные'
  },
  components: {
  },
  data: () => ({
    valid: true,
    name: '',
    nameRules: [
      v => !!v || 'Имя обязательно',
      v => (v && v.length >= 2) || 'Имя должно быть больше 2х символов',
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail обязателен',
      v => /.+@.+\..+/.test(v) || 'E-mail некорректный',
    ]
  }),
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
  },
}
</script>
