<template>
  <div class="admin-container d-flex container-fluid p-0">
    <div class="admin-content flex-grow-1">
      <div class="manage-category">
        <h3 class="bg-dark text-white p-3 ps-4 mb-4 fw-bold pe-none">
          Manage Category
        </h3>
        <div class="container-fluid content-wrapper">
          <div class="row gx-5">
            <div class="col-md-4">
              <h3 class="fw-bold mb-4 category-title pe-none">Category</h3>
            </div>
            <div class="col-md-4"></div>
            <div class="col-md-4"></div>
          </div>
          <div class="row gx-5 mt-4">
            <div class="col-md-4 custom-border">
              <div class="mx-auto w-100">
                <div class="card bg-dark text-white mb-3 custom-card">
                  <div
                    class="card-body d-flex justify-content-between align-items-center"
                  >
                    <span class="pe-none">Photo</span>
                    <button class="btn text-secondary p-0">•••</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4 custom-border">
              <CategoryList
                :categories="
                  categories.filter(
                    (cat) => typeof cat === 'object' && cat !== null
                  )
                "
                :selectedCategory="selectedCategory"
                @selectCategory="selectCategory"
                @addCategory="addCategory"
                @updateCategory="updateCategory"
                @deleteCategory="confirmDeleteCategory"
              />
            </div>

            <div class="col-md-4 custom-border">
              <SubCategoryList
                :category="selectedCategory"
                @addSubCategory="addSubCategory"
                @updateSubCategory="updateSubCategory"
                @deleteSubCategory="confirmDeleteSubCategory"
              />
            </div>
          </div>

          <!-- <div class="row button-group">
            <div class="col-12 d-flex justify-content-end">
              <button class="btn btn-choice btn-primary me-2">Save</button>
              <button class="btn btn-choice btn-outline-secondary" @click="resetCategories">
                Reset
              </button>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      v-if="isDeleteModalVisible"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete Confirmation</h5>
            <button
              type="button"
              class="btn-close"
              @click="cancelDelete"
            ></button>
          </div>
          <div class="modal-body">
            <p v-if="deletingType === 'category'">
              Are you sure you want to delete this category?
            </p>
            <p v-if="deletingType === 'subcategory'">
              Are you sure you want to delete this subcategory?
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cancelDelete"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteConfirmed"
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
import axios from "axios";
import CategoryList from "./CategoryList.vue";
import SubCategoryList from "./SubCategoryList.vue";
import store from "@/store";

const categories = ref([]);
const initialCategories = ref([]); // 초기 상태를 저장하는 변수
const selectedCategory = ref(null);
const categoryToDelete = ref(null);
const subCategoryToDelete = ref(null);
const deletingType = ref("");
const isDeleteModalVisible = ref(false);

// 카테고리 데이터 로드
const loadCategories = async () => {
  try {
    await store.dispatch('category/getAllCategories');
    categories.value=store.state.category.categories;
    initialCategories.value = JSON.parse(JSON.stringify(store.state.category.categories)); // 데이터를 복사해서 초기 상태로 저장
  } catch (error) {
    console.error("카테고리 목록 로드 실패:", error);
  }
};

const createCategory = async (newCategory) => {
  try {
    // POST 요청으로 새 카테고리 데이터를 백엔드로 전송
    const response = await axios.post("/categories", newCategory);

    if (response.data && typeof response.data === "object") {
      // 응답 받은 새 카테고리 데이터를 categories 배열에 추가
      categories.value.push(response.data);
      console.log("Category created successfully:", response.data);
    } else {
      console.error("Invalid category data:", response.data);
    }
  } catch (error) {
    console.error("Failed to create category:", error);
  }
};

const updateCategory = async (id, newName) => {
  const category = categories.value.find((cat) => cat.id === id);
  if (category) {
    try {
      // PUT request to update category name
      await axios.put(`/categories/${id}`, { name: newName });
      category.name = newName; // Update UI after successful API call
      console.log("Category updated successfully:", id);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  }
};

// 카테고리 삭제 함수
const deleteCategory = async (categoryId) => {
  try {
    // 백엔드에 카테고리가 사용 중인지 확인하는 API 호출 (axios 사용)
    const response = await axios.get(`/categories/${categoryId}/used`);
    const isUsed = response.data; // 백엔드에서 boolean 값 반환

    if (isUsed) {
      // 사용 중이면 경고 모달 띄우기
      alert(
        "The category is being used in a project, or a subcategory is being used in a project, so it cannot be deleted"
      );
    } else {
      // 사용 중이 아니면 삭제 진행
      const deleteResponse = await axios.delete(`/categories/${categoryId}`);

      if (deleteResponse.status === 200) {
        // 삭제 성공 시 처리
        alert("카테고리가 삭제되었습니다.");
        // UI에서 카테고리 제거
        removeCategoryFromUI(categoryId);
      } else {
        // 삭제 실패 시 처리
        alert("카테고리 삭제에 실패했습니다.");
      }
    }
  } catch (error) {
    console.error("카테고리 사용 확인 또는 삭제 중 오류 발생:", error);
  }
};

const createSubCategory = async (newSubCategory) => {
  if (!selectedCategory.value) {
    console.error("No category selected.");
    return;
  }

  try {
    // POST 요청으로 새 서브 카테고리 데이터를 백엔드로 전송
    const response = await axios.post(
      `/category/${selectedCategory.value.id}/subcategory`,
      newSubCategory
    );

    if (response.data && typeof response.data === "object") {
      // 응답 받은 새 서브 카테고리 데이터를 해당 카테고리에 추가
      if (!selectedCategory.value.subCategories) {
        selectedCategory.value.subCategories = [];
      }
      selectedCategory.value.subCategories.push(response.data);
      console.log("Subcategory created successfully:", response.data);
    } else {
      console.error("Invalid subcategory data:", response.data);
    }
  } catch (error) {
    console.error("Failed to create subcategory:", error);
  }
};

const deleteSubCategory = async (subCategoryId) => {
  try {
    const response = await axios.get(`/subcategory/${subCategoryId}/used`);
    const isUsed = response.data; // 백엔드에서 boolean 값 반환
    if (isUsed) {
      // 사용 중이면 경고 모달 띄우기
      alert(
        "The category is being used in a project, or a subcategory is being used in a project, so it cannot be deleted"
      );
    } else {
      await axios.delete(`/subcategory/${subCategoryId}`);
      // 삭제 후 프론트엔드에서 서브카테고리를 제거
      selectedCategory.value.subCategories =
        selectedCategory.value.subCategories.filter(
          (sub) => sub.id !== subCategoryId
        );
      console.log("서브카테고리 삭제 성공:", subCategoryId);
    }
  } catch (error) {
    console.error("서브카테고리 삭제 실패:", error);
  }
};

onMounted(() => {
  loadCategories(); // 컴포넌트가 마운트되면 카테고리 목록을 로드
});

// UI에서 카테고리 제거 함수
function removeCategoryFromUI(categoryId) {
  categories.value = categories.value.filter((cat) => cat.id !== categoryId);
}

// 카테고리 선택
const selectCategory = (category) => {
  selectedCategory.value = category;
};

// 카테고리 추가
const addCategory = () => {
  const newCategory = { name: "New Category" };
  // 새 카테고리를 생성 후 서버로 전송
  createCategory(newCategory);
};

// // 카테고리 수정
// const updateCategory = (id, newName) => {
//   const category = categories.value.find((cat) => cat.id === id);
//   if (category) {
//     category.name = newName;
//   }
// };

// 서브 카테고리 추가
const addSubCategory = () => {
  if (selectedCategory.value) {
    const newSubCategory = { name: "New SubCategory" };
    createSubCategory(newSubCategory);
  } else {
    console.error("No category selected to add a subcategory.");
  }
};

// 서브 카테고리 수정
const updateSubCategory = async (subCategoryId, newName) => {
  if (selectedCategory.value && selectedCategory.value.subCategories) {
    const subCategory = selectedCategory.value.subCategories.find(
      (sub) => sub.id === subCategoryId
    );
    if (subCategory) {
      try {
        // PUT request to update subcategory name
        await axios.put(`/subcategories/${subCategoryId}`, { name: newName });
        subCategory.name = newName; // Update UI after successful API call
        console.log("Subcategory updated successfully:", subCategoryId);
      } catch (error) {
        console.error("Failed to update subcategory:", error);
      }
    }
  }
};

// 서브 카테고리 삭제 확인 모달 열기
const confirmDeleteSubCategory = (subCategoryId) => {
  subCategoryToDelete.value = subCategoryId;
  deletingType.value = "subcategory";
  isDeleteModalVisible.value = true;
};

// 카테고리 삭제 확인 모달 열기
const confirmDeleteCategory = (id) => {
  categoryToDelete.value = id;
  deletingType.value = "category";
  isDeleteModalVisible.value = true;
};

// 모달에서 삭제 확정
const deleteConfirmed = () => {
  if (deletingType.value === "category") {
    deleteCategory(categoryToDelete.value); // 선택된 카테고리 삭제
    if (
      selectedCategory.value &&
      selectedCategory.value.id === categoryToDelete.value
    ) {
      selectedCategory.value = null;
    }
    categoryToDelete.value = null;
  } else if (deletingType.value === "subcategory" && selectedCategory.value) {
    deleteSubCategory(subCategoryToDelete.value); // 선택된 서브카테고리 삭제
    subCategoryToDelete.value = null;
  }
  isDeleteModalVisible.value = false;
  deletingType.value = "";
};

// 삭제 취소
const cancelDelete = () => {
  isDeleteModalVisible.value = false;
  categoryToDelete.value = null;
  subCategoryToDelete.value = null;
  deletingType.value = "";
};
</script>

<style scoped>
.content-wrapper {
  padding: 80px;
}

.button-group {
  margin-top: 150px;
}

.admin-container {
  display: flex;
  min-height: 100vh;
}

.btn-choice {
  height: 40px;
  width: 120px;
}

.admin-content {
  flex-grow: 1;
}

.custom-border {
  border-right: 1px solid #dee2e6;
}

.category-title {
  padding-left: 15px;
}

.custom-card .card-body {
  padding: 0.5rem 1rem;
}

.modal {
  display: block;
  background: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  margin-top: 10%;
}
</style>