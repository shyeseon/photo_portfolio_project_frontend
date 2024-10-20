<template>
  <nav aria-label="Page navigation" class="mt-5 pt-3">
    <ul class="pagination justify-content-center">
      <!-- 이전 페이지로 이동 -->
      <li class="page-item" :class="{ disabled: currentPage === 0 }">
        <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 0">&laquo;</button>
      </li>

      <!-- 페이지 번호 리스트 -->
      <li v-for="page in pagesToDisplay" :key="page" :class="['page-item', { active: page === currentPage }]">
        <button class="page-link" @click="changePage(page)">{{ page + 1 }}</button>
      </li>

      <!-- 다음 페이지로 이동 -->
      <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
        <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages - 1">&raquo;</button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
});

const emit = defineEmits(['page-changed']);

// 페이지 번호 표시 범위를 계산하는 로직
const pagesToDisplay = computed(() => {
  const range = 3; // 현재 페이지를 기준으로 앞뒤로 2개의 페이지 표시
  const start = Math.max(0, props.currentPage - range); // 시작 페이지 번호
  const end = Math.min(props.totalPages, props.currentPage + range + 1); // 끝 페이지 번호

  return Array.from({ length: end - start }, (v, i) => i + start);
});

// 페이지 변경 함수
const changePage = (newPage) => {
  if (newPage >= 0 && newPage < props.totalPages) {
    emit('page-changed', newPage);
  }
};
</script>

<style scoped>
.page-link {
  color: #999;
  background-color: #000;
  border-color: #444;
}

.page-item.active .page-link {
  z-index: 1;
  color: #ccc;
  font-weight: bold;
  background-color: #333;
  border-color: #444;
}

.page-link:focus,
.page-link:hover {
  color: #ccc;
  background-color: #222;
  border-color: #444;
}
</style>
