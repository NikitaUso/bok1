<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <header>
      <div class="logo-container">
        <div class="logo">Extern redovisning 🎓</div>
      </div>

      <!-- Center title removed: only nav links are shown in header -->
      <nav>
        <RouterLink to="/">Flashcards</RouterLink>
        <RouterLink to="/tva">T-konton</RouterLink>
        <RouterLink to="/tre">Quiz</RouterLink>
        <RouterLink to="/fyra">Räkna på rapporter och analyser</RouterLink>
        <RouterLink to="/ai">AI-Skapare</RouterLink>

        <div class="dropdown" aria-haspopup="true">
          <a class="drop-btn">Extra ▾</a>
          <div class="dropdown-menu" role="menu">
            <RouterLink class="dropdown-item" to="/extra/atervinningsvarde"
              >Återvinningsvärde</RouterLink
            >
            <RouterLink class="dropdown-item" to="/extra/utgifter">Bokslutstablå</RouterLink>
            <RouterLink class="dropdown-item" to="/extra/utgifter-ny"
              >Nya utgifter övningar</RouterLink
            >
            <RouterLink class="dropdown-item" to="/extra/r_syss">R_syss</RouterLink>
            <RouterLink class="dropdown-item" to="/extra/personalkostnader"
              >Personalkostnader</RouterLink
            >
            <RouterLink class="dropdown-item" to="/extra/vaxelkurser">Växelkurser</RouterLink>
            <RouterLink class="dropdown-item" to="/extra/periodisering">Periodisering</RouterLink>
            <RouterLink class="dropdown-item" to="/extra/nettoforsaljningsvarde"
              >Nettoförsäljningsvärde</RouterLink
            >
          </div>
        </div>
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
/* Extra dropdown */
.dropdown {
  position: relative;
  display: inline-block;
}
.drop-btn {
  color: #bdc3c7;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: default;
  padding: 4px 6px;
}
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: #2c3e50;
  border-radius: 6px;
  padding: 6px 0;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  min-width: 200px;
  z-index: 200;
}
.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: #bdc3c7;
  text-decoration: none;
  font-weight: 600;
}
.dropdown-item:hover {
  background: #34495e;
  color: #fff;
}
.dropdown:hover .dropdown-menu {
  display: block;
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
