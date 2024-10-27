<template>
  <div class="admin-container d-flex container-fluid p-0">
    <div class="admin-content flex-grow-1">
      <div class="manage-category">
        <h3 class="bg-dark text-white p-3 ps-4 mb-4 fw-bold pe-none">
          Manage Projects
        </h3>

        <!-- 검색 입력 필드와 검색 버튼 추가 -->
        <div
          class="d-flex justify-content-between align-items-center mb-3 mx-5 mt-5 mb-3"
        >
          <div class="d-flex manage-image-padding">
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="Search by project title"
              class="form-control w-100 me-2"
              @keyup.enter="handleSearch"
            />
            <button class="btn btn-primary me-2" @click="handleSearch">
              Search
            </button>
            <button
              class="btn btn-secondary"
              @click="clearSearch"
              v-if="isSearched"
            >
              Clear
            </button>
          </div>

          <div>
            <RouterLink to="/Admin/AdminUpload" class="btn btn-primary">
              Create Project
            </RouterLink>
          </div>
        </div>

        <!-- 데이터 로딩 중일 때 스피너 표시 -->
        <div v-if="isLoading" class="spinner-overlay">
          <div class="spinner-border text-dark" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- 데이터 로딩 완료 후 검색 결과 표시 -->
        <div v-else>
          <div v-if="projects.length">
            <table class="table table-hover text-center align-middle mt-4">
              <thead>
                <tr>
                  <th @click="sort('id')" class="category col-md-1 sort-button">
                    No
                    <i
                      v-if="currentSort === 'id'"
                      :class="
                        currentSortDir === 'asc'
                          ? 'fa fa-arrow-up'
                          : 'fa fa-arrow-down'
                      "
                    ></i>
                  </th>
                  <th class="thumbnail none-sort-button">Thumbnail</th>
                  <th
                    @click="sort('title')"
                    class="category col-md-3 text-center sort-button"
                  >
                    Project name
                    <i
                      v-if="currentSort === 'title'"
                      :class="
                        currentSortDir === 'asc'
                          ? 'fa fa-arrow-up'
                          : 'fa fa-arrow-down'
                      "
                    ></i>
                  </th>
                  <th class="category col-md-2 text-center none-sort-button">
                    Category
                  </th>
                  <th
                    @click="sort('createdAt')"
                    class="category col-md-1 sort-button"
                  >
                    Date
                    <i
                      v-if="currentSort === 'createdAt'"
                      :class="
                        currentSortDir === 'asc'
                          ? 'fa fa-arrow-up'
                          : 'fa fa-arrow-down'
                      "
                    ></i>
                  </th>
                  <th
                    @click="sort('imageCount')"
                    class="category col-md-1 none-sort-button"
                  >
                    Images
                  </th>
                  <th
                    @click="sort('view')"
                    class="category col-md-1 sort-button"
                  >
                    Views
                    <i
                      v-if="currentSort === 'view'"
                      :class="
                        currentSortDir === 'asc'
                          ? 'fa fa-arrow-up'
                          : 'fa fa-arrow-down'
                      "
                    ></i>
                  </th>
                  <th class="col-md-2"></th>
                </tr>
              </thead>
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
                    <span class="underline-text pe-none">{{
                      project.title
                    }}</span>
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
                        @click="clickEdit(project.id)"
                      >
                        edit
                      </button>
                      <button
                        class="btn btn-danger img-edit-buttons btn-sm w-50"
                        @click="clickDeleteModal(project.id)"
                      >
                        delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 검색 결과가 없을 때 메시지 출력 -->
          <div v-else>
            <p class="text-center text-muted mt-5 pt-5">검색 결과 없음</p>
          </div>
        </div>

        <Pagination
          v-if="!isLoading"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-changed="handlePageChange"
        />
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
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
            <h5 class="modal-title" id="deleteModalLabel">
              Delete Confirmation
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this project?
          </div>
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
              @click="deleteProject(currentItemNo)"
              data-bs-dismiss="modal"
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
import { ref, onMounted } from "vue";
import Pagination from "./Pagination.vue";
import axios from "axios";
import { Modal } from "bootstrap";
import { useRouter } from "vue-router";
const router = useRouter();

const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(0);
const projects = ref([]);
const currentSort = ref("id"); // 기본 정렬 기준
const currentSortDir = ref("desc"); // 기본 정렬 방향
const currentItemNo = ref(null);
const searchKeyword = ref(""); // 검색 키워드
const isLoading = ref(true); // 로딩 상태 변수
const isSearched = ref(false);
onMounted(() => {
  loadProjects();
});

// 프로젝트 데이터 로드
const loadProjects = async () => {
  isLoading.value = true; // 로딩 시작
  try {
    const response = await axios.get("/get/adminProject", {
      params: {
        page: currentPage.value,
        size: pageSize.value,
        sort: currentSort.value, // 정렬 기준
        direction: currentSortDir.value, // 정렬 방향
        keyWord: searchKeyword.value, // 검색 키워드
      },
    });
    projects.value = response.data.content;
    totalPages.value = response.data.totalPages;
    console.log("프로젝트 목록 로드 성공:", response.data);
  } catch (error) {
    console.error("프로젝트 목록 로드 실패:", error);
  } finally {
    isLoading.value = false; // 로딩 종료
  }
};


// 정렬 처리
const sort = (sortField) => {
  if (currentSort.value === sortField) {
    currentSortDir.value = currentSortDir.value === "asc" ? "desc" : "asc"; // 정렬 방향 토글
  } else {
    currentSort.value = sortField;
    currentSortDir.value = "asc"; // 새 필드를 선택하면 오름차순으로 정렬
  }
  loadProjects(); // 정렬 변경 후 데이터 로드
};

// EDIT 버튼 클릭 시 실행
function clickEdit(index) {
  console.log("수정 index: " + index);
  router.push(`AdminUpload/${index}`);
}

function clickDeleteModal(index) {
  currentItemNo.value = index;
  const deleteModal = new Modal(document.getElementById("deleteModal"));
  deleteModal.show();
}

const deleteProject = async (id) => {
  try {
    const response = await axios.delete(`/delete/project/${id}`);
    console.log("프로젝트 삭제 성공:", response);
    currentItemNo.value = null;
    // 삭제된 프로젝트를 projects 배열에서 제거
    projects.value = projects.value.filter((project) => project.id !== id);
  } catch (error) {
    console.error("프로젝트 삭제 실패:", error);
  }
};

const handleSearch = () => {
  currentPage.value = 0; 
  loadProjects(); 
  isSearched.value = true; 
};

const clearSearch = () => {
  searchKeyword.value = "";
  isSearched.value = false; 
  handleSearch(); 
};

// 페이지 변경 시 호출되는 함수
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  loadProjects();
};
</script>

<style scoped>
.spinner-overlay {
  position: absolute;
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
  z-index: 10; /* 필요에 따라 z-index 조정 */
}
.sort-button {
  cursor: pointer;
}
.none-sort-button {
  cursor: default;
}
</style>
