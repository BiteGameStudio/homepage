<!-- layouts/default.vue -->
<template>
  <div class="layout">
    <header class="header">
      <h1>Bite Game Studio</h1>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/anthology">anthology</NuxtLink>
      </nav>
    </header>

    <main class="content">
      <NuxtPage />
    </main>

    <footer class="footer">
      <p>&copy; 2024 Bite Game Studio. All rights reserved.</p>
    </footer>
  </div>
</template>
