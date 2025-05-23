<template>
    <div class="game-container">
        <button @click="send({ type: 'FLIP_CARD' })" class="flip-button">
            Flip Card
        </button>

        <div :class="['card', cardFlippedStyles]">
            <div class="card-inner">
                <div class="card-front">
                    <p>{{ amountToIncrement }}</p>
                </div>
                <div class="card-back">
                    <p>Card Back</p>
                </div>
            </div>
        </div>

        <div v-if="state.matches('cardFlipped')" class="card-flipped">
            <p>The card is flipped!</p>
            <button @click="send({ type: 'UPDATE_TOTAL' })" class="update-total-button">
                Update Total
            </button>
        </div>

        <div v-if="state.matches('updatingTotal')" class="side-panel updating">
            <p>Updating Total...</p>
        </div>

        <div v-if="state.matches('waitingForNextTurn')" class="waiting">
            <p>Waiting for next turn...</p>
            <button @click="send({ type: 'START_NEW_TURN' })">Start New Turn</button>
        </div>

        <!-- Side panel with the updated total -->
        <div :class="['side-panel', state.matches('updatingTotal') ? 'updating' : '']">
            <h2>Total: {{ total }}</h2>
        </div>
    </div>
</template>

<script setup>
import { useMachine } from '@xstate/vue'
import { cardGameMachine } from '../machines/cardGameMachine'
import { computed, ref, watch, watchEffect } from 'vue'

const { state, send } = useMachine(cardGameMachine)
const total = ref(0)
const amountToIncrement = ref(4)
console.log('INITIAL STATE', state)

watch(state, (newValue, oldValue) => {
    console.log(
        `%cstate changed from: %c${oldValue.value} %cto: %c${newValue.value}`,
        'color: gray',         // 'state changed from:'
        'color: red; font-weight: bold', // old state
        'color: gray',         // 'to:'
        'color: green; font-weight: bold' // new state
    )


    if (state.value.matches('updatingTotal')) {
        updateTotal()
    }

    if (state.value.matches('flippingCard')) {
        setTimeout(() => {
            send({ type: 'CARD_FLIPPED' })
        }, 1000) // match the CSS animation time
    }
})
// Example of updating the total when the card is flipped
const updateTotal = () => {
    console.log('updateTotal')
    const newAmount = total.value + amountToIncrement.value
    const interval = setInterval(() => {
        if (total.value < newAmount) {
            total.value += 1
        } else {
            clearInterval(interval)
            send({ type: 'TOTAL_UPDATED' })
        }
    }, 1000) // change this speed as desired


    setTimeout(() => {
        send({ type: 'TOTAL_UPDATED' })
    }, 4000)
}


const cardFlippedStyles = computed(() => {
    let styles = ''
    if (state.value.matches('flippingCard') || state.value.value !== 'idle') {
        styles += 'flipping'
    }
    return styles;

});

</script>

<style scoped>
.game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.flip-button {
    margin-bottom: 20px;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;
}

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

.update-total-button {
    padding: 10px 20px;
    background-color: #e67e22;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 20px;
}

.side-panel {
    position: absolute;
    margin-top: 30px;
    padding: 20px;
    background-color: #f39c12;
    color: black;
    width: 250px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 1s, transform 1s;
}

.side-panel.updating {
    opacity: 1;
    transform: translateX(0);
}

.waiting {
    margin-top: 20px;
    font-size: 20px;
}

.waiting button {
    padding: 10px 20px;
    background-color: #8e44ad;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 20px;
}
</style>