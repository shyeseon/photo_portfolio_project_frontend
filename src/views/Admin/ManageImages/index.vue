<template>
  <div class="admin-container d-flex container-fluid p-0">
    <div class="admin-content flex-grow-1">
      <div class="manage-category">
        <h3 class="bg-dark text-white p-3 ps-4 mb-4 fw-bold pe-none">Manage Projects</h3>
        <div class="manage-image-padding">
          <div class="d-flex justify-content-end align-items-center">
            <RouterLink class="btn btn-primary" to="/Admin/AdminUpload"
              >Create Project</RouterLink
            >
          </div>
          <table class="table table-hover text-center align-middle mt-4">
            <!-- <thead>
              <tr>
                <th @click="sort('no')" class="category col-md-1">
                  No
                  <span v-if="currentSort === 'no'">{{
                    currentSortDir === "asc" ? "↑" : "↓"
                  }}</span>
                </th>
                <th class="thumbnail">Thumbnail</th>
                <th @click="sort('projectName')" class="category col-md-3 text-center">
                  Project name
                  <span v-show="currentSort === 'projectName'">{{
                    currentSortDir === "asc" ? "↑" : "↓"
                  }}</span>
                </th>
                <th @click="sort('category')" class="category  col-md-2 text-center">
                  Category
                  <span v-if="currentSort === 'category'">{{
                    currentSortDir === "asc" ? "↑" : "↓"
                  }}</span>
                </th>
                <th @click="sort('date')" class="category col-md-1">
                  Date
                  <span v-if="currentSort === 'date'">{{
                    currentSortDir === "asc" ? "↑" : "↓"
                  }}</span>
                </th>
                <th @click="sort('images')" class="category col-md-1">
                  Images
                  <span v-if="currentSort === 'images'">{{
                    currentSortDir === "asc" ? "↑" : "↓"
                  }}</span>
                </th>
                <th @click="sort('views')" class="category col-md-1">
                  Views
                  <span v-if="currentSort === 'views'">{{
                    currentSortDir === "asc" ? "↑" : "↓"
                  }}</span>
                </th>
                <th class="col-md-2"></th>
              </tr>
            </thead> -->
            <tbody>
              <tr v-for="project in projects" :key="project.id">
                <td class="pe-none">{{ project.id }}</td>
                <td>
                  <img
                    :src="project.imageUrl"
                    alt="thumbnail"
                    style="width: 100px; height: 100px"
                  />
                </td>
                <td>
                  <span class="underline-text pe-none">{{ project.title }}</span>
                </td>
                <td class="pe-none">{{ project.categoryName }}</td>
                <td class="pe-none">{{ project.createdAt }}</td>
                <td class="pe-none">+{{ project.imageCount }}</td>
                <td class="pe-none">{{ project.view }}</td>
                <td>
                  <div
                    class="d-flex flex-column justify-content-center align-items-center"
                  >
                    <button
                      class="btn btn-secondary img-edit-buttons btn-sm mb-1 w-50"
                      @click="clickEdit(item.no)"
                    >
                      edit
                    </button>
                    <button
                      class="btn btn-danger img-edit-buttons btn-sm w-50"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteModal"
                      @click="clickDelete(item.no)"
                    >
                      delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <Pagination />
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="edeleteModalLabel">Delete</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">Are you sure you want to delete this project?</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
              @click="clickDeleteConfirmModal"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Pagination from "./Pagination.vue";
import axios from "axios";
import "@/apis/axiosConfig";

const currentItemNo = ref(0);
const currentSort = ref("");
const currentSortDir = ref("asc");
const projects = ref([]);

onMounted(() => {
  loadProjects();
});

// 프로젝트 데이터 로드
const loadProjects = async () => {
  try {
    const response = await axios.get("/get/adminProject");
    projects.value = response.data;
    console.log("프로젝트 목록 로드 성공:", response.data);
  } catch (error) {
    console.error("프로젝트 목록 로드 실패:", error);
  }
};

// const sort = (s) => {
//   if (s === currentSort.value) {
//     currentSortDir.value = currentSortDir.value === "asc" ? "desc" : "asc";
//   }
//   currentSort.value = s;
// };

// const sortedItems = computed(() => {
//   return [...items.value].sort((a, b) => {
//     let modifier = 1;
//     if (currentSortDir.value === "desc") modifier = -1;
//     if (a[currentSort.value] < b[currentSort.value]) return -1 * modifier;
//     if (a[currentSort.value] > b[currentSort.value]) return 1 * modifier;
//     return 0;
//   });
// });

function clickEdit(index) {
  console.log("수정 index: " + index);
}
function clickDelete(index) {
  currentItemNo.value = index;
}
function clickDeleteConfirmModal() {
  console.log("삭제하려는 프로젝트 값: " + currentItemNo.value);

  //axios 통신 코드 작성 자리

  currentItemNo.value = 0;
}
</script>

<style scoped>
.table > thead > tr > .category {
  cursor: pointer;
}

.table > thead > tr > .thumbnail {
  cursor: default;
}

.manage-image-padding {
  padding: 40px;
}

.img-edit-buttons {
  height: 35px;
}

.underline-text {
  display: inline-block;
  border-bottom: 1px solid #000;
  padding-bottom: 4px;
}

</style>
