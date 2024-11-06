<template>
  <nav class="sidebar sticky-top">
    <div class="position-sticky pt-3 ms-4 me-5">
      <h1 class="h2 mb-5 fw-bold">
        <RouterLink class="text-decoration-none text-dark" to="/">Minography</RouterLink>
      </h1>
      <div class="accordion" id="photoProjectsAccordion">
        <div class="accordion-item border-0">
          <h2 class="accordion-header" id="headingPhotoProjects">
            <button
              class="accordion-button border-0 bg-transparent fw-bold pb-0 ps-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapsePhotoProjects"
              aria-expanded="true"
              aria-controls="collapsePhotoProjects"
            >
              Photo projects
            </button>
          </h2>
          <div
            id="collapsePhotoProjects"
            class="accordion-collapse collapse show"
            aria-labelledby="headingPhotoProjects"
            data-bs-parent="#photoProjectsAccordion"
          >
            <div class="accordion-body pt-0 mb-3">
              <ul class="nav flex-column">
                <li class="nav-item" v-for="category in categories" :key="category.id">
                  <RouterLink
                    class="nav-link"
                    :to="category.id ? { name: 'photoList', params: { categoryId: category.id }} : '/'"
                    active-class="active"
                    @click="menuItemClicked"
                  >{{ category.name }}</RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ul class="nav flex-column mt-3 fw-bold">
        <li class="nav-item">
          <RouterLink class="nav-link pb-3" to="/about" active-class="active" @click="menuItemClicked">About</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link mb-3" to="/contact" active-class="active" @click="menuItemClicked">Contact</RouterLink>
        </li>
        <li class="nav-item" v-if="store.state.id">
          <RouterLink class="nav-link mb-3" to="/Admin/ManageImages" active-class="active" @click="menuItemClicked">Admin</RouterLink>
        </li>
      </ul>
      <div class="mt-3 ms-3 mb-3">
        <a href="https://www.instagram.com/" class="sns-link text-dark"><i class="fa-brands fa-instagram me-3"></i></a>
        <a href="https://www.youtube.com/" class="sns-link text-dark"><i class="fa-brands fa-youtube"></i></a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import store from "@/store";

const categories = ref([]);
const route = useRoute();

// 페이지에 따라 적절한 카테고리를 가져오는 함수
const getCategory = async () => {
  try {
    const viewParam = route.name === "admin" ? "admin" : "main";
    await store.dispatch('category/getAllCategories',{view:viewParam});
    categories.value=store.state.category.categories;

    categories.value.unshift({
      id: null,
      name: "All"
    })
  } catch (error) {
    console.error("카테고리 로드 실패:", error);
  }
};

// 페이지가 로드될 때 세션을 확인하고 카테고리를 가져옵니다.
onMounted(async () => {
  // await checkSession();
  await getCategory();
});

const emit = defineEmits(["menuItemClicked"]);

function menuItemClicked() {
  emit("menuItemClicked");
}
</script>

<style scoped>
.accordion-button {
  box-shadow: none;
}

.accordion-button:focus {
  box-shadow: none;
}

.accordion-button:not(.collapsed) {
  color: inherit;
  background-color: transparent;
  box-shadow: none;
  border-bottom: none;
}

.nav-link {
  color: #000;
}

.nav-link.active {
  font-weight: bold;
  color: #007bff;
}
</style>