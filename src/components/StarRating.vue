<template>
  <div class="star-rating">
    <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= numericRating }">&#9733;</span>
  </div>
</template>

<script>
export default {
  props: {
    averageRating: {
      type: [Number, String, Array],
      required: true,
    },
  },
  computed: {
    numericRating() {
      if (Array.isArray(this.averageRating)) {
        const total = this.averageRating.reduce((sum, rating) => sum + Number(rating.rating), 0);
        return total / this.averageRating.length;
      }
      return Number(this.averageRating);
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