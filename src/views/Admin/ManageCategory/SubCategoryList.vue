<template>
  <div v-if="category" class="mx-auto w-100">
    <div v-for="element in subCategoriesList" :key="element.id" class="mb-3">
      <SubCategoryItem
        :subCategory="element"
        @update="$emit('updateSubCategory', element.id, $event)"
        @delete="$emit('deleteSubCategory', element.id)"
      />
    </div>

    <div class="mb-3">
      <div class="new-button rounded" @click="$emit('addSubCategory')">
        <span>+ </span>
        <span class="text-decoration-underline">New Sub-category</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import SubCategoryItem from './SubCategoryItem.vue';

const props = defineProps({
  category: Object,
});

const emit = defineEmits(['addSubCategory', 'updateSubCategory', 'deleteSubCategory']);

const subCategoriesList = computed({
  get: () => props.category.subCategories || [],
  set: (value) => emit('update:subCategories', value)
});
</script>

<style scoped>
.new-button {
  cursor: pointer;
  padding: 10px;
}
.new-button:hover{
  background-color: #ddd;
  transition: 0.25s ease;
}
</style>
