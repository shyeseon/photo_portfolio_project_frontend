<template>
  <div
    class="container d-flex align-items-center justify-content-center"
    style="height: 100vh"
  >
    <div class="login-form-container">
      <h3 class="mb-3 fw-bold text-center">Admin</h3>
      <form class="mt-4" @submit.prevent="handleLogin">
        <div class="mb-3 input-group-container">
          <input
            type="text"
            class="form-control custom-input border border-secondary"
            placeholder="ID"
            v-model="loginInfo.id"
          />
          <div class="error-message-container">
            <small v-if="loginError === 'id'" class="text-danger">
              Invalid Id
            </small>
          </div>
        </div>
        <div class="mb-2 input-group-container">
          <input
            type="password"
            class="form-control custom-input border border-secondary"
            placeholder="PASSWORD"
            v-model="loginInfo.password"
          />
          <div class="error-message-container">
            <small v-if="loginError === 'password'" class="text-danger">
              Invalid Password
            </small>
          </div>
        </div>
        <button type="submit" class="btn btn-dark custom-input mt-2" :disabled="!isLoginFormValid">
          Login
        </button>
        <div class="error-message-container mt-2">
          <small v-if="loginError === 'both'" class="text-danger d-block">
            The account does not exist
          </small>
        </div>
      </form>
      <div class="mt-3">
        <a href="#" class="text-start">Forgot your Id</a>
        <span class="text-primary"> / </span>
        <a href="#" class="text-start">password</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

// 로그인 실패 시 사용
const loginError = ref("");

// 로그인 작성 폼
const loginInfo = ref({
  id: "",
  password: "",
});

const handleLogin = () => {
    // 임시 비밀번호
  const tempId = "admin";
  const tempPassword = "12345";
  console.log(JSON.parse(JSON.stringify(loginInfo.value)));

   // 로그인 성공 시 admin manage images 페이지로 이동
  if(loginInfo.value.id === tempId && loginInfo.value.password === tempPassword) {
    router.push("/Admin/ManageImages");
  } else{
    loginError.value = 
      (loginInfo.value.id !== tempId && loginInfo.value.password !== tempPassword) ? "both"
      : loginInfo.value.id !== tempId ? "id"
      : "password";
  }
};

// 로그인 버튼 활성화
const isLoginFormValid = computed(() => {
  return loginInfo.value.id !== "" && loginInfo.value.password !== "";
});
</script>

<style scoped>
.login-form-container {
  width: 450px;
  max-width: 100%;
}

.custom-input {
  width: 100%;
  height: 50px;
  font-weight: bold;
}

.input-group-container {
  height: 70px;
}

.error-message-container {
  height: 15px;
}
</style>