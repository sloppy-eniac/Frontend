<script>
  export let registers = { A: 0, B: 0, C: 0, D: 0 };
  
  let previousValues = { ...registers };
  let highlightedRegs = {};
  
  $: {
    // 값 변경 감지 및 하이라이트
    Object.keys(registers).forEach(reg => {
      if (registers[reg] !== previousValues[reg]) {
        highlightedRegs[reg] = true;
        setTimeout(() => {
          highlightedRegs[reg] = false;
          highlightedRegs = { ...highlightedRegs };
        }, 800);
      }
    });
    previousValues = { ...registers };
  }
</script>

<div class="card">
  <div class="card-header">
    <h3 class="card-title">레지스터</h3>
  </div>
  <div class="card-content">
    <div class="registers-grid">
      {#each Object.entries(registers) as [name, value]}
        <div 
          class="register-item" 
          class:highlight={highlightedRegs[name]}
        >
          <div class="register-name">{name}</div>
          <div class="register-value">{value}</div>
        </div>
      {/each}
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
  
  .registers-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  
  .register-item {
    background: hsl(210 40% 98%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.375rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  
  .register-item:hover {
    background: hsl(210 40% 96%);
  }
  
  .register-item.highlight {
    background: hsl(221.2 83.2% 53.3% / 0.1);
    border-color: hsl(221.2 83.2% 53.3%);
    transform: scale(1.02);
    box-shadow: 0 0 0 2px hsl(221.2 83.2% 53.3% / 0.2);
  }
  
  .register-item.highlight::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, hsl(221.2 83.2% 53.3% / 0.3), transparent);
    animation: shine 0.8s ease-out;
  }
  
  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  .register-name {
    font-weight: 600;
    color: hsl(221.2 83.2% 53.3%);
    font-size: 1rem;
  }
  
  .register-value {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 1.25rem;
    font-weight: 600;
    color: hsl(222.2 84% 4.9%);
    background: hsl(0 0% 100%);
    padding: 0.5rem 0.75rem;
    border-radius: 0.25rem;
    border: 1px solid hsl(214.3 31.8% 91.4%);
    min-width: 3rem;
    text-align: center;
  }
  
  @media (max-width: 640px) {
    .registers-grid {
      grid-template-columns: 1fr;
    }
  }
</style> 