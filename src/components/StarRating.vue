<template>
  <div class="star-rating">
    <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= averageRating }">&#9733;</span>
  </div>
</template>

<script>
export default {
  props: {
    averageRating: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.star {
  font-size: 24px;
  color: #ccc;
}
.star.filled {
  color: #f39c12;
}
</style>