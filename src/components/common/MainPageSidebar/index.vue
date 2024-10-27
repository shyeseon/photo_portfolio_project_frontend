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
                <li class="nav-item">
                  <RouterLink class="nav-link" to="/" @click="menuItemClicked">All</RouterLink>
                </li>
                <li class="nav-item" v-for="(category) in categories" :key="category.id">
                  <RouterLink
                    class="nav-link"
                    :to="{ name: 'photoList', params: { categoryId: category.id } }"
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
          <RouterLink class="nav-link pb-3" to="/about" @click="menuItemClicked">About</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link mb-3" to="/contact" @click="menuItemClicked">Contact</RouterLink>
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
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const categories = ref([]);
const route = useRoute();

// 페이지에 따라 적절한 카테고리를 가져오는 함수
const getCategory = async () => {
  try {
    const viewParam = route.name === 'admin' ? 'admin' : 'main';
    const response = await axios.get(`/get/categories`, {
      params: { view: viewParam }
    });
    categories.value = response.data.map(category => ({
      id: category.id,
      name: category.name
    }));
  } catch (error) {
    console.error("카테고리 로드 실패:", error);
  }
};


onMounted(getCategory);

const emit = defineEmits(['menuItemClicked']);

function menuItemClicked() {
  emit('menuItemClicked');
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
}
</style>
