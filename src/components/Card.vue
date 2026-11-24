<template>
    <div :class="['card', cardFlippedStyles]">
        <div class="card-inner">
            <div class="card-front">
                <p>{{ amount }}</p>
            </div>
            <div class="card-back">
                <p>{{ userForCard?.name ?? 'n/a' }}</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { sampleUsers } from '../data/sampleUsers';

interface CardProps {
    id: string
    amount: number
    userId: string
    cardGameState: any
    active: boolean;
}

const { amount, userId, cardGameState, active } = defineProps<CardProps>()

const users = computed(() => sampleUsers)
const userForCard = computed(() => users.value.find(u => u.id === userId))

const cardFlippedStyles = computed(() => {
    let styles = ''
    if (active && (['flippingCard', 'cardFlipped', 'updatingTotal'].some((s) => cardGameState.matches(s)))) {
        styles += 'flipping'
    }
    return styles
})

</script>
<style>
.card {
    width: 100px;
    height: 100px;
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