<script setup lang="ts">
import { LocalStorage } from 'quasar';
import { computed, onMounted, ref, type Ref } from 'vue';
import { query } from '../graphql/auth';
import { apolloCl, $q } from '../main';
import { SUCCESS } from '../boot/constant';
const isPwd: Ref<boolean> = ref(true);
const email: Ref<string> = ref('');
const password: Ref<string> = ref('');
const loading: Ref<boolean[]> = ref([false, false, false, false, false, false]);
const success: Ref<boolean> = ref(false);
onMounted(() => {
  LocalStorage.set('auth', {
    accessToken: '',
    refreshToken: '',
    tokenType: '',
    flag: '',
  });
});
const isValidEmail = computed(() => {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(email.value) || 'Invalid email';
});
const showPassword = computed(() => {
  if (isPwd.value === true) {
    return 'password';
  } else {
    return 'text';
  }
});
const visibilityPassword = computed(() => {
  if (isPwd.value === true) {
    return 'visibility_off';
  } else {
    return 'visibility';
  }
});
function onSubmit() {
  apolloCl
    .query({
      query,
      variables: {
        password: password.value,
        email: email.value,
        grantType: 'password',
      },
    })
    .then((res: any) => {
      const { login } = res.data;
      if (login.statusCode === SUCCESS) {
        LocalStorage.set('auth', {
          accessToken: login?.data?.accessToken.accessToken,
          refreshToken: login?.data?.refreshToken.refreshToken,
          tokenType: login?.data?.tokenType,
          flag: login?.data.flag,
        });
        $q.notify({
          type: 'positive',
          position: 'top',
          classes: 'q-mt-lg',
          message: 'Success',
        });
      } else {
        $q.notify({
          type: 'negative',
          position: 'top',
          classes: 'q-mt-lg',
          message: 'User name or password incorrect!',
        });
      }
    })
    .catch(({ graphQLErrors }: any) => {
      if (graphQLErrors)
        $q.notify({
          type: 'negative',
          position: 'top',
          classes: 'q-mt-lg',
          message: 'User name or password incorrect!',
        });
    });
}
// eslint-disable-next-line no-unused-vars
function simulateProgress(number: any) {
  loading.value[number] = true;
  setTimeout(() => {
    loading.value[number] = false;
  }, 3000);
}
</script>
<template>
  <div class="wrapper shadow-box" :class="`shadow-14`">
    <div class="wrapper__header"><h2>Login</h2></div>
    <div class="wrapper__content">
      <q-form @submit="onSubmit">
        <q-input
          class="wrapper__content__inputLogin"
          color="positive"
          v-model="email"
          type="email"
          label="Email"
          :rules="[(val) => (!val ? 'Must be not empty!' : isValidEmail)]"
        />
        <q-input
          class="wrapper__content__inputLogin"
          color="positive"
          v-model="password"
          label="Password"
          :type="showPassword"
          :rules="[(val) => (val && val.trim().length) || 'Must be not empty']"
        >
          <template v-slot:append>
            <q-icon
              :name="visibilityPassword"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-btn
          :loading="loading[3]"
          color="primary"
          style="width: 150px"
          type="submit"
        >
          Login
          <template v-if="success" v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Loading...
          </template>
        </q-btn>
      </q-form>
      <div class="wrapper__content__register-link">
        Don't have account?&nbsp;<a href="/register">Register</a>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
h2 {
  text-align: left;
  font-weight: 800;
}
.wrapper {
  max-width: 70%;
  margin: 9rem auto;
  padding: 7rem;
  background-color: rgba(207, 234, 255, 0.3);
  border-radius: 0.5rem;
  box-shadow: inset;
  &__header {
    max-width: 42%;
    border-bottom: 0.25rem solid rgba(77, 42, 82, 0.5);
    margin-left: 6rem;
  }
  &__content {
    max-width: 75%;
    margin: 0 auto;
    &__inputLogin {
      margin: 2.5rem 0;
    }
    &__register-link {
      margin-left: 4rem;
      font-size: 1rem;
    }
  }
  .q-btn {
    padding: 1rem 5rem;
    float: right;
  }
  .q-field {
    font-size: 1.5rem;
    margin-left: 4rem;
  }
}
</style>
