<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

// Räknar ut vad som ska stå i mitten baserat på vilken sida vi är på
const pageTitle = computed(() => {
  switch (route.name) {
    case 'flashcards':
      return 'Flashcards'
    case 'two':
      return 'T-konton' // Vi kan döpa om dessa routes senare
    case 'three':
      return 'Quiz'
    case 'four':
      return 'Rapporter & analyser'
    default:
      return 'EduAccount 🎓'
  }
})
</script>

<template>
  <div class="app-layout">
    <header>
      <div class="logo-container">
        <div class="logo">Extern redovisning 🎓</div>
      </div>

      <div class="center-title">{{ pageTitle }}</div>
      <nav>
        <RouterLink to="/">Flashcards</RouterLink>
        <RouterLink to="/tva">T-konton</RouterLink>
        <RouterLink to="/tre">Quiz</RouterLink>
        <RouterLink to="/fyra">Räkna på rapporter och analyser</RouterLink>
        <RouterLink to="/formler">Formler</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Global reset */
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  background-color: #f4f7f6;
  font-family: 'Segoe UI', sans-serif;
}

#app {
  width: 100%;
  max-width: 100%;
  display: block;
}

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

header {
  background-color: #2c3e50;
  padding: 0 2rem;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Separerar vänster och höger */
  width: 100%;
  box-sizing: border-box;
  position: relative; /* Viktigt för att mitten-titeln ska kunna positioneras */
  z-index: 10;
}

.logo-container {
  flex: 1; /* Tar upp plats till vänster */
}

.logo {
  color: white;
  font-weight: bold;
  font-size: 1.4rem;
}

/* Den centrerade titeln */
.center-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%); /* Flyttar tillbaka den så den blir exakt centrerad */
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  letter-spacing: 1px;
  white-space: nowrap;
}

nav {
  flex: 1; /* Tar upp plats till höger */
  display: flex;
  justify-content: flex-end; /* Tryck länkarna längst till höger */
  gap: 30px;
}

nav a {
  color: #bdc3c7;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.3s;
}

nav a:hover {
  color: white;
}
nav a.router-link-active {
  color: #42b883;
  border-bottom: 2px solid #42b883;
}

main {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
