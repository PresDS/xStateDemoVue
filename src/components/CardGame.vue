<template>

    <button @click="send({ type: 'FLIP_CARD' })" :disabled="!cardGameState.matches('idle')" class="flip-button">
        Flip Card
    </button>

    <div class="game-container">


        <div :class="['side-panel']">
            <div v-if="cardGameState.matches('cardFlipped')" class="card-flipped">
                <button @click="send({ type: 'UPDATE_TOTAL' })" class="update-total-button">
                    Update Total
                </button>
            </div>

            <div v-if="cardGameState.matches('updatingTotal')" class="side-panel updating">
                <p>Updating Total...</p>
            </div>

            <div v-if="cardGameState.matches('waitingForNextTurn')" class="waiting">
                <p>Waiting for next turn...</p>
                <button @click="send({ type: 'START_NEW_TURN' })">Start New Turn</button>
            </div>

            <div v-if="cardGameState.matches('gameOver')" class="waiting">
                <p>Game over!</p>
                <button @click="send({ type: 'RESTART' })">Play Again</button>
            </div>

            <ul>
                <li v-for="user in cardGameState.context.users" :key="user.id">
                    <p>{{ user.name }}</p>
                    <p>{{ displayedTotals[user.id] ?? 0 }}</p>
                </li>
            </ul>
        </div>

        <div class="card-container">
            <Card v-for="card in cardGameState.context.cards" :key="card.id" :id="card.id" :amount="card.amount" :userId="card.userId"
                :active="isCardActive(card)" :cardGameState="cardGameState" />
        </div>
    </div>

</template>

<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { cardGameMachine, type CardData } from '../machines/cardGameMachine'
import { reactive, watch } from 'vue'
import Card from './Card.vue'

const { snapshot: cardGameState, send } = useMachine(cardGameMachine)

const isCardActive = (card: CardData) =>
    cardGameState.value.context.cards[cardGameState.value.context.activeCardIndex]?.id === card.id

// The machine owns the real totals; this only animates the displayed count.
const displayedTotals = reactive<Record<string, number>>({})

const animateTo = (userId: string, target: number) => {
    const start = displayedTotals[userId] ?? 0
    if (target <= start) {
        displayedTotals[userId] = target
        return
    }
    const duration = 1500
    const t0 = performance.now()
    const step = (now: number) => {
        const progress = Math.min((now - t0) / duration, 1)
        displayedTotals[userId] = Math.round(start + (target - start) * progress)
        if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
}

watch(
    () => cardGameState.value.context.users,
    (users) => users.forEach((u) => animateTo(u.id, u.total)),
    { immediate: true }
)
</script>

<style scoped>
.game-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20px;
    width: 100%;
}

.flip-button {
    margin-bottom: 20px;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;
}

.card-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
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
    /* position: absolute; */
    margin-top: 30px;
    padding: 20px;
    background-color: #28252b;
    color: black;
    font-size: 24px;
    font-weight: bold;
}

.side-panel ul {
    list-style-type: none;
}

.side-panel ul li {
    color: white;
    background-color: #8e44ad;
    border-radius: 12px;
}

.waiting {
    margin-top: 20px;
    font-size: 20px;
    color: yellow;
}

.waiting button {
    padding: 10px 20px;
    background-color: #4486ad;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 20px;
}
</style>