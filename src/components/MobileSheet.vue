<template>
  <div class="mobile-sheet">
    <div class="mobile-sheet-container">
      <slot></slot>
    </div>
    <img class="mobile-sheet-bottomTear" src="../assets/images/bottom-tear.svg" />
  </div>
</template>

<script>
export default {
  name: 'mobile-sheet'
}
</script>

<style lang="less">
.mobile-sheet {
  margin: 24px;
  max-width: 360px;
  .mobile-sheet-container {
    border: 1px solid #d9d9d9;
    border-bottom: none;
    overflow: hidden;
  }
  .mobile-sheet-bottomTear {
    display: block;
    position: relative;
    margin-top: -10px;
    max-width: 360px;
  }
}
</style>
