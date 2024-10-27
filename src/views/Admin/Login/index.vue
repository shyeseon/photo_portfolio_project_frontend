<template>
  <div
    class="container d-flex align-items-center justify-content-center"
    style="height: 100vh"
  >
    <div class="login-form-container">
      <h3 class="mb-3 fw-bold text-center">Admin</h3>
      <form class="mt-4" @submit.prevent="handleLoginSubmit">
        <div class="mb-3 input-group-container">
          <input
            type="text"
            name="id"
            class="form-control custom-input border border-secondary"
            placeholder="ID"
            v-model="admin.id"
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
            name="password"
            class="form-control custom-input border border-secondary"
            placeholder="PASSWORD"
            v-model="admin.password"
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
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import store from "@/store";
import axios from "axios";
const router = useRouter();

// 로그인 실패 시 사용
const loginError = ref("");

// 로그인 작성 폼
const admin = ref({
  id: "",
  password: "",
});

// 로그인 
const handleLoginSubmit = async () => {
  try {
    // spring security에서 formLogin 사용하기 때문에 formData로 바꿔서 전송해야 됨
    const formData = new FormData();
    formData.append("id", admin.value.id);
    formData.append("password", admin.value.password);

    await store.dispatch("login", formData);

    // 로그인 성공 후 원래 가려던 경로로 리다이렉트
    const redirect = router.currentRoute.value.query.redirect || "/Admin/ManageImages";  // redirect 쿼리 또는 기본 경로
    router.push(redirect);

  } catch (error) {
    // loginError.value = 
    //   (admin.value.id !== tempId && admin.value.password !== tempPassword) ? "both"
    //   : admin.value.id !== tempId ? "id"
    //   : "password";
  }
};

// 로그인 버튼 활성화
const isLoginFormValid = computed(() => {
  return admin.value.id !== "" && admin.value.password !== "";
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