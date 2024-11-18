<template>
  <div class="layout-container">
    <!-- 로그인 페이지가 아닐 때 사이드바 표시 -->
    <div v-if="!isLoginPage && !isNotFoundPageCheck" class="sidebar-part d-none d-md-block">
      <Sidebar v-if="!check" />
      <AdminSidebar v-if="check" />
    </div>

    <!-- 콘텐츠 영역 -->
    <div class="content">
      <!-- 모바일용 네비게이션 바 -->
      <nav class="navbar d-md-none navbar-light bg-light" v-if="!isLoginPage && !isNotFoundPageCheck">
        <div class="container-fluid">
          <RouterLink class="navbar-brand mb-0 h1 fw-bold text-decoration-none" to="/">Minography</RouterLink>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasSidebar"
            aria-controls="offcanvasSidebar"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      <!-- 모바일용 오프캔버스 사이드바 -->
      <div
        v-if="!isLoginPage && !isNotFoundPageCheck"
        class="offcanvas offcanvas-start"
        tabindex="-1"
        id="offcanvasSidebar"
        aria-labelledby="offcanvasSidebarLabel"
        ref="offcanvasElement"
      >
        <div class="offcanvas-header">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body overflow-hidden">
          <Sidebar v-if="!check" @menuItemClicked="closeOffcanvas" />
          <AdminSidebar v-if="check" class="h-100 bg-black"/>
        </div>
      </div>

      <!-- 메인 콘텐츠 -->
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Offcanvas } from "bootstrap";
import Sidebar from "@/components/common/MainPageSidebar";
import AdminSidebar from "@/components/AdminSidebar";
import { useRoute } from "vue-router";
import "@/apis/axiosConfig"; // axios 기본 설정을 전체 앱에 적용
const route = useRoute();

const isNotFoundPageCheck = computed(() => route.path === "/404");
const check = computed(() => route.path.toLowerCase().includes("/admin"));
const isLoginPage = computed(() => route.path.toLowerCase().includes("/login"));

const offcanvasElement = ref(null);
let offcanvasInstance = null;

onMounted(() => {
  if (offcanvasElement.value) {
    offcanvasInstance = new Offcanvas(offcanvasElement.value);
  }
});

function closeOffcanvas() {
  if (offcanvasInstance) {
    offcanvasInstance.hide();
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
}

.content {
  flex: 1;
}

.sidebar {
  width: 250px;
  min-height: 100vh;
}

@media screen and (max-width: 768px) {
  .layout-container {
    display: block;
  }
}

.offcanvas {
  width: 250px;
}
</style>
