<template>
    <div :class="['card', cardFlippedStyles]">
        <div class="card-inner">
            <div class="card-front">
                <p>{{ amount }}</p>
            </div>
            <div class="card-back">
                <p>Card Back</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { StateFrom, StateMachine } from 'xstate';

interface CardProps {
    id: string
    amount: number
    userId: string
    cardGameState: any
}

const { id, amount, userId, cardGameState } = defineProps<CardProps>()

onBeforeMount(() => {
    console.log('cardGameState', cardGameState)
})

const cardFlippedStyles = computed(() => {
    let styles = ''
    if (cardGameState.matches('flippingCard') || cardGameState.value !== 'idle') {
        styles += 'flipping'
    }
    return styles
})

</script>
<style>
.card {
    width: 200px;
    height: 300px;
    perspective: 1000px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 1s;
}

.card.flipping .card-inner {
    transform: rotateY(180deg);
}

.card-front,
.card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
}

.card-back {
    background-color: #e74c3c;
    color: white;
}

.card-front {
    background-color: #2ecc71;
    color: white;
    transform: rotateY(180deg);
}

.card-flipped {
    margin-top: 20px;
    font-size: 24px;
}
</style>