<script>
  import confetti from 'canvas-confetti';

  let showSuccess = $state(false);
  let userName = $state('');
  let showNamePrompt = $state(true);
  let buttonsSwapped = $state(false);
  let swapCooldown = false;
  let noAttempts = $state(0);
  let forcedYes = $state(false);

  // Speech bubble state
  let showBubble = $state(false);
  let bubbleMessage = $state('');

  const bubbleMessages = [
    "Give me a chance!",
    "Pretty please?",
    "Don't be shy!",
    "Think about it!",
    "I'll be sweet!",
    "Come on...",
    "Just say yes!",
    "I promise hugs!",
    "You won't regret it!",
    "Be my Valentine?"
  ];

  function showTeddyMessage() {
    bubbleMessage = bubbleMessages[Math.floor(Math.random() * bubbleMessages.length)];
    showBubble = true;
  }

  function handleNameSubmit(e) {
    e.preventDefault();
    if (userName.trim()) {
      showNamePrompt = false;
    }
  }

  function handleYes() {
    showSuccess = true;
    showBubble = false;

    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#E57373', '#FFB74D', '#FFF176', '#A1887F']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#E57373', '#FFB74D', '#FFF176', '#A1887F']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  function handleNoEnter() {
    if (swapCooldown || forcedYes) return;
    noAttempts++;

    if (noAttempts >= 10) {
      forcedYes = true;
      bubbleMessage = "You gave me no choice!";
      showBubble = true;
      return;
    }

    buttonsSwapped = !buttonsSwapped;
    showTeddyMessage();
    swapCooldown = true;
    setTimeout(() => {
      swapCooldown = false;
    }, 400);
  }
</script>

<div class="teddy-container">
  <!-- Left Panel - Form -->
  <div class="left-panel">
    {#if showNamePrompt}
      <div class="teddy-card">
        <h2 class="teddy-title">Welcome!</h2>
        <p class="teddy-subtitle">Please enter your name to continue</p>

        <form onsubmit={handleNameSubmit}>
          <input
            type="text"
            bind:value={userName}
            placeholder="Your name"
            class="teddy-input"
            autofocus
            required
          />
          <button type="submit" class="teddy-submit-btn">
            Continue
          </button>
        </form>
      </div>
    {:else if !showSuccess}
      <div class="teddy-card">
        <h2 class="teddy-title">
          Will you be my Valentine, {userName}?
        </h2>
        <p class="teddy-subtitle">
          I promise to make every day as sweet as honey!
        </p>

        <div class="teddy-buttons">
          <button onclick={handleYes} class="teddy-yes-btn" class:swapped={buttonsSwapped}>
            Yes!
          </button>

          {#if forcedYes}
            <button onclick={handleYes} class="teddy-yes-btn">
              Yes!
            </button>
          {:else}
            <button
              class="teddy-no-btn"
              class:swapped={buttonsSwapped}
              onmouseenter={handleNoEnter}
            >
              No
            </button>
          {/if}
        </div>
      </div>
    {:else}
      <div class="teddy-card success">
        <h2 class="teddy-title">Yay! Thank You!</h2>
        <p class="teddy-subtitle highlight">You just made my heart skip a beat!</p>
        <p class="teddy-subtitle">
          I can't wait to celebrate Valentine's Day with you!
        </p>
      </div>
    {/if}
  </div>

  <!-- Right Panel - Teddy Bear -->
  <div class="right-panel">
    <div class="teddy-wrapper">
      <!-- Speech Bubble -->
      {#if showBubble && !showSuccess}
        <div class="speech-bubble">
          {bubbleMessage}
        </div>
      {/if}

      <!-- Teddy Bear SVG -->
      <svg class="teddy-bear" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <!-- Left Ear -->
        <circle cx="45" cy="45" r="30" fill="#D2691E"/>
        <circle cx="45" cy="45" r="18" fill="#DEB887"/>

        <!-- Right Ear -->
        <circle cx="155" cy="45" r="30" fill="#D2691E"/>
        <circle cx="155" cy="45" r="18" fill="#DEB887"/>

        <!-- Head -->
        <circle cx="100" cy="85" r="65" fill="#D2691E"/>

        <!-- Inner face -->
        <ellipse cx="100" cy="95" rx="45" ry="40" fill="#DEB887"/>

        <!-- Left Eye -->
        <ellipse cx="75" cy="75" rx="10" ry="12" fill="#2C1810"/>
        <circle cx="77" cy="72" r="3" fill="white"/>

        <!-- Right Eye -->
        <ellipse cx="125" cy="75" rx="10" ry="12" fill="#2C1810"/>
        <circle cx="127" cy="72" r="3" fill="white"/>

        <!-- Nose -->
        <ellipse cx="100" cy="100" rx="12" ry="10" fill="#2C1810"/>
        <ellipse cx="98" cy="98" rx="4" ry="3" fill="#5C4033" opacity="0.5"/>

        <!-- Mouth -->
        <path d="M 85 115 Q 100 130 115 115" stroke="#2C1810" stroke-width="3" fill="none" stroke-linecap="round"/>

        <!-- Blush -->
        <ellipse cx="55" cy="95" rx="12" ry="8" fill="#FFB6C1" opacity="0.6"/>
        <ellipse cx="145" cy="95" rx="12" ry="8" fill="#FFB6C1" opacity="0.6"/>

        <!-- Body -->
        <ellipse cx="100" cy="170" r="45" fill="#D2691E"/>

        <!-- Belly -->
        <ellipse cx="100" cy="170" rx="30" ry="25" fill="#DEB887"/>

        <!-- Left Arm -->
        <ellipse cx="45" cy="160" rx="20" ry="30" fill="#D2691E" transform="rotate(-20, 45, 160)"/>

        <!-- Right Arm -->
        <ellipse cx="155" cy="160" rx="20" ry="30" fill="#D2691E" transform="rotate(20, 155, 160)"/>

        <!-- Heart -->
        <path d="M 100 155
                 C 100 150, 90 145, 85 150
                 C 80 155, 80 165, 100 180
                 C 120 165, 120 155, 115 150
                 C 110 145, 100 150, 100 155"
              fill="#E57373"/>
      </svg>
    </div>
  </div>
</div>
