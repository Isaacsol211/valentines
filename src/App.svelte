<script>
  import TeddyValentine from './TeddyValentine.svelte';
  import PinkValentine from './PinkValentine.svelte';

  // Theme toggle - 'teddy' or 'pink' (pink is default)
  let currentTheme = $state('pink');

  function toggleTheme() {
    currentTheme = currentTheme === 'teddy' ? 'pink' : 'teddy';
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
