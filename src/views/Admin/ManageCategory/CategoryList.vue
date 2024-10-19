<template>
  <div class="mx-auto w-100">
    <div v-for="element in categoriesList" :key="element.id" class="mb-3">
      <CategoryItem
        :category="element"
        :isSelected="selectedCategory && selectedCategory.id === element.id"
        @select="$emit('selectCategory', element)"
        @update="$emit('updateCategory', element.id, $event)"
        @delete="$emit('deleteCategory', element.id)"
      />
    </div>
    <div class="mb-3 ">
      <div class="new-button rounded" @click="$emit('addCategory')">
        <span>+ </span>
        <span class="text-decoration-underline">New Category</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import CategoryItem from "./CategoryItem.vue";

const props = defineProps({
  categories: Array,
  selectedCategory: Object,
});

const emit = defineEmits([
  "selectCategory",
  "addCategory",
  "updateCategory",
  "deleteCategory",
]);

const categoriesList = computed({
  get: () => props.categories,
  set: (value) => emit("update:categories", value),
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
