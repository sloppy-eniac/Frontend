<script>
  export let operation = '대기 중...';
  
  let isActive = false;
  let previousOperation = operation;
  
  $: {
    if (operation !== previousOperation && operation !== '대기 중...') {
      isActive = true;
      setTimeout(() => {
        isActive = false;
      }, 1500);
    }
    previousOperation = operation;
  }
</script>

<div class="card" class:active={isActive}>
  <div class="card-header">
    <h3 class="card-title">산술논리장치 (ALU)</h3>
  </div>
  <div class="card-content">
    <div class="operation-display" class:computing={isActive}>
      <div class="operation-text">{operation}</div>
      {#if isActive}
        <div class="computing-indicator">
          <div class="pulse"></div>
          <div class="pulse"></div>
          <div class="pulse"></div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .card {
    background: hsl(0 0% 100%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 hsl(0 0% 0% / 0.05);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .card.active {
    border-color: hsl(45.4 93.4% 47.5%);
    box-shadow: 0 0 0 2px hsl(45.4 93.4% 47.5% / 0.2);
    animation: aluGlow 1.5s ease-in-out;
  }
  
  @keyframes aluGlow {
    0%, 100% { 
      box-shadow: 0 0 0 2px hsl(45.4 93.4% 47.5% / 0.2);
    }
    50% { 
      box-shadow: 0 0 0 4px hsl(45.4 93.4% 47.5% / 0.4);
    }
  }
  
  .card-header {
    padding: 1rem 1.5rem 0 1.5rem;
  }
  
  .card-title {
    font-size: 1rem;
    font-weight: 600;
    color: hsl(222.2 84% 4.9%);
    margin: 0;
  }
  
  .card-content {
    padding: 1rem 1.5rem 1.5rem;
  }
  
  .operation-display {
    background: hsl(210 40% 98%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.375rem;
    padding: 1.5rem 1rem;
    text-align: center;
    position: relative;
    min-height: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    transition: all 0.3s ease;
  }
  
  .operation-display.computing {
    background: hsl(45.4 93.4% 47.5% / 0.1);
    border-color: hsl(45.4 93.4% 47.5%);
    animation: computingPulse 1.5s ease-in-out;
  }
  
  @keyframes computingPulse {
    0%, 100% { 
      background: hsl(45.4 93.4% 47.5% / 0.1);
    }
    50% { 
      background: hsl(45.4 93.4% 47.5% / 0.2);
    }
  }
  
  .operation-text {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 1.125rem;
    font-weight: 600;
    color: hsl(222.2 84% 4.9%);
    word-break: break-all;
  }
  
  .computing-indicator {
    display: flex;
    gap: 0.375rem;
    align-items: center;
  }
  
  .pulse {
    width: 0.5rem;
    height: 0.5rem;
    background: hsl(45.4 93.4% 47.5%);
    border-radius: 50%;
    animation: pulseAnimation 1.5s ease-in-out infinite;
  }
  
  .pulse:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .pulse:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes pulseAnimation {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
  
  .card.active::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, hsl(45.4 93.4% 47.5% / 0.3), transparent);
    animation: sweep 1.5s ease-out;
  }
  
  @keyframes sweep {
    0% { left: -50%; }
    100% { left: 100%; }
  }
</style> 