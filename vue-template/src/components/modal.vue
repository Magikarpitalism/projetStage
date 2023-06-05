<template>
    <transition name="modal">
      <div class="modal-mask" @click="close">
        <div class="modal-container" @click.stop>
          <!-- Your modal content goes here -->
          <slot></slot>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: 'modal',
    methods: {
      close() {
        this.$emit('close');
      },
    },
  };
  </script>
  
  <style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-container {
    width: 800px;
    background-color: rgb(36, 36, 61);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33); 
  }
  </style>