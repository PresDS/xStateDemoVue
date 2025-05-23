<template>
    <div class="container">
        <button @click="send({ type: 'TOGGLE' })">Toggle Box</button>
  
      <Transition name="fade">
        <div v-if="state?.matches('visible')" class="box"></div>
      </Transition>
      <p>{{ state?.value }}</p>
    </div>
  </template>
  
  <script setup>
  import { useMachine } from '@xstate/vue'
  import { boxMachine } from '../machines/boxMachine'
  
  const { state, send } = useMachine(boxMachine)
  console.log(state)
  </script>
  
  <style scoped>
  .container {
    text-align: center;
    padding: 2rem;
  }
  
  button {
    padding: 10px 20px;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  .box {
    width: 200px;
    height: 200px;
    background-color: #42b983;
    margin: 0 auto;
    border-radius: 8px;
  }
  
  /* Animation */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  