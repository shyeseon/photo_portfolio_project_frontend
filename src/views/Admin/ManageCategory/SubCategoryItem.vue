<template>
  <div class="card mb-3 custom-card">
    <div class="card-body d-flex justify-content-between ps-2 align-items-center">
      <div class="d-flex align-items-center">
        <!-- 편집 모드가 아닌 경우 -->
        <span v-if="!isEditing" class="pe-none">{{ subCategory.name }}</span>

        <!-- 편집 모드일 때 입력 필드 -->
        <input
          v-else
          v-model="editName"
          ref="editInput"
          class="form-control form-control-sm"
        />
      </div>

      <!-- 상태에 따라 다른 버튼 표시 -->
      <div v-if="!isEditing" class="dropdown">
        <button class="btn p-0 text-secondary" data-bs-toggle="dropdown">
          •••
        </button>
        <ul class="dropdown-menu">
          <li>
            <button class="dropdown-item" @click="handleEdit">Edit</button>
          </li>
          <li>
            <button class="dropdown-item" @click="$emit('delete')">Delete</button>
          </li>
        </ul>
      </div>

      <!-- 편집 모드일 때 변경 및 취소 버튼 표시 -->
      <div v-else class="d-flex">
        <button class="btn btn-outline-primary btn-sm me-2" @click="handleSave">Save</button>
        <button class="btn btn-outline-secondary btn-sm" @click="cancelEdit">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";

const props = defineProps({
  subCategory: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update", "delete"]);

const isEditing = ref(false);
const editName = ref(props.subCategory.name);
const editInput = ref(null);

// 편집 모드로 전환
const handleEdit = () => {
  isEditing.value = true;
  nextTick(() => {
    editInput.value.focus(); // 입력 필드에 포커스
  });
};

// 저장 (변경 사항을 백엔드로 전송)
const handleSave = () => {
  if (editName.value.trim() !== "") {
    emit("update", editName.value.trim()); // 변경 사항을 부모 컴포넌트로 전달
    isEditing.value = false; // 편집 모드 종료
  } else {
    editName.value = props.subCategory.name; // 값이 없을 때 원래 값으로 복구
    isEditing.value = false;
  }
};

// 편집 취소
const cancelEdit = () => {
  editName.value = props.subCategory.name; // 원래 값으로 복구
  isEditing.value = false; // 편집 모드 종료
};
</script>

<style scoped>
.form-control-sm {
  height: 25px;
  font-size: 0.875rem;
}

.dropdown-menu {
  min-width: 6rem;
}

.dropdown-item {
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
}

.custom-card .card-body {
  padding: 0.5rem 1rem;
}
</style>
