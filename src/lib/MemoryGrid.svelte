<script>
  /** @type {number[]} */
  export let memory = [];
  
  /** @type {number[]} */
  let previousMemory = [...memory];
  /** @type {Record<number, boolean>} */
  let highlightedCells = {};
  
  $: {
    // 메모리 변경 감지
    memory.forEach((value, index) => {
      if (index < 64 && value !== previousMemory[index]) {
        highlightedCells[index] = true;
        setTimeout(() => {
          highlightedCells[index] = false;
          highlightedCells = { ...highlightedCells };
        }, 1000);
      }
    });
    previousMemory = [...memory];
  }
  
  // 64바이트만 표시
  $: displayMemory = memory.slice(0, 64);
</script>

<div class="card">
  <div class="card-header">
    <h3 class="card-title">메모리 (64바이트)</h3>
  </div>
  <div class="card-content">
    <div class="grid-container">
      {#each displayMemory as value, index}
        <div 
          class="memory-cell"
          class:highlight={highlightedCells[index]}
          title="주소: {index}, 값: {value}"
        >
          <div class="address">{index.toString(16).padStart(2, '0').toUpperCase()}</div>
          <div class="value">{value}</div>
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
    grid-column: 1 / -1;
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
  
  .grid-container {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 0.25rem;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .memory-cell {
    background: hsl(210 40% 98%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.25rem;
    padding: 0.5rem 0.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.125rem;
    transition: all 0.2s ease;
    cursor: pointer;
    position: relative;
    min-height: 3.5rem;
  }
  
  .memory-cell:hover {
    background: hsl(210 40% 96%);
    border-color: hsl(221.2 83.2% 53.3%);
    transform: scale(1.05);
  }
  
  .memory-cell.highlight {
    background: hsl(0 84.2% 60.2% / 0.1);
    border-color: hsl(0 84.2% 60.2%);
    transform: scale(1.1);
    box-shadow: 0 0 0 2px hsl(0 84.2% 60.2% / 0.2);
    animation: memoryPulse 1s ease-out;
  }
  
  @keyframes memoryPulse {
    0% { 
      box-shadow: 0 0 0 2px hsl(0 84.2% 60.2% / 0.2);
    }
    50% { 
      box-shadow: 0 0 0 4px hsl(0 84.2% 60.2% / 0.4);
    }
    100% { 
      box-shadow: 0 0 0 2px hsl(0 84.2% 60.2% / 0.2);
    }
  }
  
  .address {
    font-size: 0.625rem;
    color: hsl(215.4 16.3% 46.9%);
    font-weight: 500;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  }
  
  .value {
    font-size: 0.75rem;
    color: hsl(222.2 84% 4.9%);
    font-weight: 600;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    min-height: 1rem;
  }
  
  @media (max-width: 768px) {
    .grid-container {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  @media (max-width: 480px) {
    .grid-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style> 