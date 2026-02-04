<script>
  import confetti from 'canvas-confetti';
  import { onMount } from 'svelte';

  let showSuccess = $state(false);
  let userName = $state('');
  let showNamePrompt = $state(true);
  let noButtonPos = $state({ x: 0, y: 0 });
  let noButtonVelocity = { x: 0, y: 0 };
  let isButtonActive = $state(false);
  let canActivate = false; // Prevents immediate activation after name submit
  let isMobile = $state(false);
  let hearts = $state([]);
  let noButtonRef = $state(null);
  let tauntIndex = $state(0);
  let lastTauntChange = 0;
  let animationFrame = null;
  let mousePos = { x: 0, y: 0 };

  const taunts = [
    "Nope! 😜",
    "Too slow! 🏃",
    "Can't catch me! 😝",
    "Nice try! 💨",
    "Missed me! 😏",
    "Hehe! 🐰",
    "Not today! 🙈",
    "Keep trying! 😂",
    "Almost! 😛",
    "Wheee! 🎢",
    "Just say YES! 💕",
    "Come on... 🥺",
    "Please? 💖",
    "I believe in us! 💗"
  ];

  const REPULSION_RADIUS = 250; // Distance at which button starts repelling (in px)
  const REPULSION_STRENGTH = 0.5; // How strong the repulsion force is
  const FRICTION = 0.92; // Friction to slow down movement
  const MAX_SPEED = 3; // Maximum speed in vw/vh per frame

  onMount(() => {
    // Detect mobile
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Create floating hearts
    const heartEmojis = ['💕', '💖', '💗', '💓', '💞', '💘', '❤️', '🩷'];
    hearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 7,
      size: 0.8 + Math.random() * 1.2
    }));

    // Track mouse position globally
    const handleMouseMove = (e) => {
      if (showSuccess) return;
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Start animation loop
    let isRunning = true;
    
    function animate() {
      if (!isRunning) return;
      
      if (noButtonRef && !showSuccess) {
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
    
    // Button center in pixels
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    // Distance from mouse to button
    const dx = btnCenterX - mousePos.x;
    const dy = btnCenterY - mousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Apply repulsion force if mouse is close enough
    if (distance < REPULSION_RADIUS && distance > 0 && canActivate) {
      // Activate fixed positioning on first interaction
      if (!isButtonActive) {
        isButtonActive = true;
        // Set initial position based on current location
        noButtonPos = {
          x: (rect.left / viewW) * 100,
          y: (rect.top / viewH) * 100
        };
      }

      // Normalize direction and apply force
      const force = (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
      const forceX = (dx / distance) * force * REPULSION_STRENGTH;
      const forceY = (dy / distance) * force * REPULSION_STRENGTH;

      // Update velocity (mutate directly since it's not reactive)
      noButtonVelocity.x += forceX;
      noButtonVelocity.y += forceY;

      // Change taunt text when mouse gets close
      const now = Date.now();
      if (now - lastTauntChange > 800) {
        tauntIndex = (tauntIndex + 1) % taunts.length;
        lastTauntChange = now;
      }
    }

    // Only update position if button is active
    if (!isButtonActive) return;

    // Apply friction
    noButtonVelocity.x *= FRICTION;
    noButtonVelocity.y *= FRICTION;

    // Clamp velocity to max speed
    const speed = Math.sqrt(noButtonVelocity.x ** 2 + noButtonVelocity.y ** 2);
    if (speed > MAX_SPEED) {
      noButtonVelocity.x = (noButtonVelocity.x / speed) * MAX_SPEED;
      noButtonVelocity.y = (noButtonVelocity.y / speed) * MAX_SPEED;
    }

    // Update position
    let newX = noButtonPos.x + noButtonVelocity.x;
    let newY = noButtonPos.y + noButtonVelocity.y;

    // Constraints: X between -23vw to 50vw, Y between -19vh to 70vh
    const minX = -23;
    const maxX = 50;
    const minY = -19;
    const maxY = 70;

    // Bounce off boundaries
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
      // Wait 2000ms before allowing button activation
      setTimeout(() => {
        canActivate = true;
      }, 2000);
    }
  }
  
  function handleYes() {
    showSuccess = true;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    // Fire confetti
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
  
  function handleNoClick(e) {
    e.preventDefault();
    // Give the button a strong push away from click
    const rect = noButtonRef.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const dx = btnCenterX - e.clientX;
    const dy = btnCenterY - e.clientY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    noButtonVelocity.x += (dx / dist) * 5;
    noButtonVelocity.y += (dy / dist) * 5;
  }
</script>

<!-- Floating hearts background -->
<div class="hearts-bg">
  {#each hearts as heart (heart.id)}
    <span
      class="heart"
      style="left: {heart.left}%; animation-delay: {heart.delay}s; animation-duration: {heart.duration}s; font-size: {heart.size * 1.5}rem;"
    >
      {heart.emoji}
    </span>
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
  {:else if !showSuccess}
    <div class="love-letter">
      <!-- Decorative corner hearts -->
      <span class="floating-decoration" style="top: 10px; right: 15px; animation-delay: 0s;">💗</span>
      <span class="floating-decoration" style="bottom: 10px; left: 15px; animation-delay: 1s;">💕</span>

      <div class="text-center">
        <div class="big-heart">💝</div>

        <h2 class="romantic-title" style="font-size: clamp(2.5rem, 8vw, 4rem); margin: 1.5rem 0;">
          Will you be my Valentine, {userName}?
        </h2>

        <p class="subtitle">
          I promise to make every day<br/>as sweet as chocolate! 🍫✨
        </p>
      </div>

      <div class="button-container">
        <button onclick={handleYes} class="yes-btn">
          Yes! 💕
        </button>

        <button
          bind:this={noButtonRef}
          style={isButtonActive ? `--x: ${noButtonPos.x}vw; --y: ${noButtonPos.y}vh;` : ''}
          class="no-btn runaway-btn"
          class:is-running={isButtonActive}
        >
          {isButtonActive ? taunts[tauntIndex] : "No 😢"}
        </button>
      </div>
    </div>
  {:else}
    <div class="love-letter success-card">
      <span class="floating-decoration" style="top: 10px; right: 15px;">🎊</span>
      <span class="floating-decoration" style="bottom: 10px; left: 15px; animation-delay: 0.5s;">🎉</span>
      <span class="floating-decoration" style="top: 10px; left: 15px; animation-delay: 1s;">💖</span>
      <span class="floating-decoration" style="bottom: 10px; right: 15px; animation-delay: 1.5s;">✨</span>

      <div class="big-heart" style="font-size: 4rem;">💖</div>

      <h2 class="romantic-title" style="font-size: clamp(2.5rem, 10vw, 4.5rem); margin: 1rem 0;">
        Yay! Thank You!
      </h2>

      <p style="color: #be185d; font-size: 1.3rem; font-weight: 600; margin: 1rem 0;">
        You just made my heart skip a beat! ❤️
      </p>

      <p class="subtitle">
        I can't wait to celebrate<br/>Valentine's Day with you! 💕🌹
      </p>

      <div style="margin-top: 2rem; font-size: 1.8rem; opacity: 0.9;">
        💌 Forever Yours 💌
      </div>
    </div>
  {/if}
</div>
