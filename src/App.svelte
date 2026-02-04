<script>
  import confetti from 'canvas-confetti';
  import { onMount } from 'svelte';

  let showSuccess = $state(false);
  let showConfirmation = $state(false);
  let userName = $state('');
  let showNamePrompt = $state(true);
  let noButtonPos = $state({ x: 0, y: 0 });
  let noButtonVelocity = { x: 0, y: 0 };
  let isButtonActive = $state(false);
  let canActivate = false;
  let isMobile = $state(false);
  let hearts = $state([]);
  let noButtonRef = $state(null);
  let tauntIndex = $state(0);
  let lastTauntChange = 0;
  let animationFrame = null;
  let mousePos = { x: 0, y: 0 };
  let buttonsSwapped = $state(false);

  const taunts = [
    "Nope!",
    "Too slow!",
    "Can't catch me!",
    "Nice try!",
    "Missed me!",
    "Hehe!",
    "Not today!",
    "Keep trying!",
    "Almost!",
    "Just say YES!",
    "Come on...",
    "Please?",
    "I believe in us!"
  ];

  const REPULSION_RADIUS = 250;
  const REPULSION_STRENGTH = 0.5;
  const FRICTION = 0.92;
  const MAX_SPEED = 3;

  onMount(() => {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Create floating hearts - minimalistic version
    hearts = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 10,
      size: 1 + Math.random() * 1.5
    }));

    const handleMouseMove = (e) => {
      if (showSuccess || showConfirmation) return;
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    let isRunning = true;

    function animate() {
      if (!isRunning) return;

      if (noButtonRef && !showSuccess && !showConfirmation) {
        updateButtonPosition();
      }

      animationFrame = requestAnimationFrame(animate);
    }

    animationFrame = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  });

  function updateButtonPosition() {
    if (!noButtonRef) return;

    const rect = noButtonRef.getBoundingClientRect();
    const viewW = window.innerWidth;
    const viewH = window.innerHeight;

    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dx = btnCenterX - mousePos.x;
    const dy = btnCenterY - mousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < REPULSION_RADIUS && distance > 0 && canActivate) {
      if (!isButtonActive) {
        isButtonActive = true;
        noButtonPos = {
          x: (rect.left / viewW) * 100,
          y: (rect.top / viewH) * 100
        };
      }

      const force = (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
      const forceX = (dx / distance) * force * REPULSION_STRENGTH;
      const forceY = (dy / distance) * force * REPULSION_STRENGTH;

      noButtonVelocity.x += forceX;
      noButtonVelocity.y += forceY;

      const now = Date.now();
      if (now - lastTauntChange > 800) {
        tauntIndex = (tauntIndex + 1) % taunts.length;
        lastTauntChange = now;
      }
    }

    if (!isButtonActive) return;

    noButtonVelocity.x *= FRICTION;
    noButtonVelocity.y *= FRICTION;

    const speed = Math.sqrt(noButtonVelocity.x ** 2 + noButtonVelocity.y ** 2);
    if (speed > MAX_SPEED) {
      noButtonVelocity.x = (noButtonVelocity.x / speed) * MAX_SPEED;
      noButtonVelocity.y = (noButtonVelocity.y / speed) * MAX_SPEED;
    }

    let newX = noButtonPos.x + noButtonVelocity.x;
    let newY = noButtonPos.y + noButtonVelocity.y;

    const minX = -23;
    const maxX = 50;
    const minY = -25;
    const maxY = 60;

    if (newX <= minX || newX >= maxX) {
      noButtonVelocity.x *= -0.8;
      newX = Math.max(minX, Math.min(maxX, newX));
    }
    if (newY <= minY || newY >= maxY) {
      noButtonVelocity.y *= -0.8;
      newY = Math.max(minY, Math.min(maxY, newY));
    }

    noButtonPos = { x: newX, y: newY };
  }

  function handleNameSubmit(e) {
    e.preventDefault();
    if (userName.trim()) {
      showNamePrompt = false;
      setTimeout(() => {
        canActivate = true;
      }, 2000);
    }
  }

  function handleYes() {
    if (!showConfirmation) {
      showConfirmation = true;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      return;
    }

    showSuccess = true;
    showConfirmation = false;

    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0080', '#ff1493', '#ff69b4', '#ffb6c1']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0080', '#ff1493', '#ff69b4', '#ffb6c1']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  function handleCancelConfirmation() {
    showConfirmation = false;
  }

  let swapCooldown = false;

  function handleConfirmNoEnter() {
    if (swapCooldown) return;
    buttonsSwapped = !buttonsSwapped;
    swapCooldown = true;
    setTimeout(() => {
      swapCooldown = false;
    }, 400);
  }
</script>

<!-- Floating hearts background -->
<div class="hearts-bg">
  {#each hearts as heart (heart.id)}
    <svg
      class="heart"
      style="left: {heart.left}%; animation-delay: {heart.delay}s; animation-duration: {heart.duration}s; width: {heart.size * 24}px; height: {heart.size * 24}px;"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        stroke="#e91e63"
        stroke-width="1.5"
        fill="none"
      />
    </svg>
  {/each}
</div>

<div class="valentine-container">
  {#if showNamePrompt}
    <!-- Plain name entry popup -->
    <div class="name-prompt-overlay">
      <div class="name-prompt-card">
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: #333;">Welcome!</h2>
        <p style="color: #666; margin-bottom: 1.5rem;">Please enter your name to continue</p>
        
        <form onsubmit={handleNameSubmit}>
          <input
            type="text"
            bind:value={userName}
            placeholder="Your name"
            class="name-input"
            autofocus
            required
          />
          <button type="submit" class="name-submit-btn">
            Continue
          </button>
        </form>
      </div>
    </div>
  {:else if showConfirmation}
    <div class="confirmation-card">
      <h2 class="minimal-title">
        Are you sure?
      </h2>
      <p class="subtitle" style="margin-bottom: 1.5rem;">
        This will make someone very happy!
      </p>
      <div class="confirmation-buttons">
        <button onclick={handleYes} class="yes-btn" class:swapped={buttonsSwapped}>
          Yes, I'm sure!
        </button>
        <button
          class="no-btn"
          class:swapped={buttonsSwapped}
          onmouseenter={handleConfirmNoEnter}
        >
          No
        </button>
      </div>
    </div>
  {:else if !showSuccess}
    <div class="love-letter">
      <div class="text-center">
        <h2 class="minimal-title" style="font-size: clamp(2rem, 6vw, 3rem); margin: 1.5rem 0;">
          Will you be my Valentine, {userName}?
        </h2>

        <p class="subtitle">
          I promise to make every day as sweet as chocolate!
        </p>
      </div>

      <div class="button-container">
        <button onclick={handleYes} class="yes-btn">
          Yes!
        </button>

        <button
          bind:this={noButtonRef}
          style={isButtonActive ? `--x: ${noButtonPos.x}vw; --y: ${noButtonPos.y}vh;` : ''}
          class="no-btn runaway-btn"
          class:is-running={isButtonActive}
        >
          {isButtonActive ? taunts[tauntIndex] : "No"}
        </button>
      </div>
    </div>
  {:else}
    <div class="love-letter success-card">
      <h2 class="minimal-title" style="font-size: clamp(2rem, 8vw, 3.5rem); margin: 1rem 0;">
        Yay! Thank You!
      </h2>

      <p style="color: #be185d; font-size: 1.2rem; font-weight: 600; margin: 1rem 0;">
        You just made my heart skip a beat!
      </p>

      <p class="subtitle">
        I can't wait to celebrate Valentine's Day with you!
      </p>
    </div>
  {/if}
</div>
