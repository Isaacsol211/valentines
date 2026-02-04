<script>
  import { onMount } from 'svelte';
  import TeddyValentine from './TeddyValentine.svelte';
  import PinkValentine from './PinkValentine.svelte';

  // Load theme from localStorage, default to 'pink'
  let currentTheme = $state('pink');

  onMount(() => {
    const savedTheme = localStorage.getItem('valentine-theme');
    if (savedTheme === 'teddy' || savedTheme === 'pink') {
      currentTheme = savedTheme;
    }
  });

  function toggleTheme() {
    currentTheme = currentTheme === 'teddy' ? 'pink' : 'teddy';
    localStorage.setItem('valentine-theme', currentTheme);
  }
</script>

<!-- Theme Switcher Toggle -->
<button class="theme-toggle" onclick={toggleTheme} class:teddy={currentTheme === 'teddy'}>
  <span class="toggle-track">
    <span class="track-icon left">💗</span>
    <span class="track-icon right">🧸</span>
  </span>
  <span class="toggle-knob">
    {currentTheme === 'pink' ? '💗' : '🧸'}
  </span>
</button>

{#if currentTheme === 'teddy'}
  <TeddyValentine />
{:else}
  <PinkValentine />
{/if}
