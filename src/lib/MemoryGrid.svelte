<script>
  export let memory = [];
  
  let previousMemory = [...memory];
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
  
  // 명령어 영역 판별 - 더 정확한 감지
  function isInstructionArea(index) {
    // 명령어는 보통 2바이트씩 쌍을 이루므로 첫 16바이트(8개 명령어) 영역을 명령어 영역으로 간주
    if (index >= 16) return false;
    
    // 현재 바이트가 0이 아니거나, 다음 바이트와 함께 명령어를 구성하는 경우
    if (memory[index] !== 0) return true;
    
    // 짝수 인덱스(명령어의 첫 바이트)인 경우, 다음 바이트도 확인
    if (index % 2 === 0 && index + 1 < memory.length) {
      return memory[index + 1] !== 0;
    }
    
    // 홀수 인덱스(명령어의 두 번째 바이트)인 경우, 이전 바이트도 확인
    if (index % 2 === 1 && index - 1 >= 0) {
      return memory[index - 1] !== 0;
    }
    
    return false;
  }

  // 명령어 바이트를 어셈블리로 변환
  function getInstructionText(index) {
    if (index % 2 !== 0 || index + 1 >= memory.length) return '';
    
    const byte1 = memory[index];
    const byte2 = memory[index + 1];
    
    if (byte1 === 0 && byte2 === 0) return '';
    
    // 16비트 명령어 재구성
    const instruction = (byte1 << 8) | byte2;
    const opcode = (instruction >> 12) & 0xF;
    const reg1 = (instruction >> 6) & 0x3F;
    const reg2 = instruction & 0x3F;
    
    const opcodes = ['ADD', 'SUB', 'MUL', 'DIV', 'MOV'];
    if (opcode < opcodes.length) {
      return `${opcodes[opcode]} ${reg1}, ${reg2}`;
    }
    
    return '';
  }
</script>

<div class="card">
  <div class="card-header">
    <div class="header-content">
      <h3 class="card-title">메모리 (64바이트)</h3>
      <div class="legend">
        <div class="legend-item">
          <div class="legend-color instruction"></div>
          <span>명령어 영역</span>
        </div>
        <div class="legend-item">
          <div class="legend-color data"></div>
          <span>데이터 영역</span>
        </div>
      </div>
    </div>
  </div>
  <div class="card-content">
    <div class="grid-container">
      {#each displayMemory as value, index}
        <div 
          class="memory-cell"
          class:highlight={highlightedCells[index]}
          class:instruction-area={isInstructionArea(index)}
          title="{isInstructionArea(index) && index % 2 === 0 ? `명령어: ${getInstructionText(index)} | ` : ''}주소: 0x{index.toString(16).padStart(2, '0').toUpperCase()}, 값: {value} (0x{value.toString(16).padStart(2, '0').toUpperCase()})"
        >
          <div class="address">{index.toString(16).padStart(2, '0').toUpperCase()}</div>
          <div class="value">0x{value.toString(16).padStart(2, '0').toUpperCase()}</div>
          {#if isInstructionArea(index) && index % 2 === 0}
            <div class="instruction-label">{getInstructionText(index)}</div>
          {/if}
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
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
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
    min-height: 4.5rem;
    justify-content: center;
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
  
  .memory-cell.instruction-area {
    background: linear-gradient(135deg, hsl(220 70% 96%), hsl(220 70% 93%));
    border-color: hsl(220 70% 85%);
    box-shadow: 0 1px 3px 0 hsl(220 70% 85% / 0.3);
  }
  
  .memory-cell.instruction-area:hover {
    background: linear-gradient(135deg, hsl(220 70% 94%), hsl(220 70% 91%));
    border-color: hsl(220 70% 80%);
    transform: scale(1.05);
  }
  
  .memory-cell.instruction-area .address {
    color: hsl(220 70% 45%);
    font-weight: 600;
  }
  
  .memory-cell.instruction-area .value {
    color: hsl(220 70% 25%);
    font-weight: 700;
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
    font-size: 0.65rem;
    color: hsl(222.2 84% 4.9%);
    font-weight: 600;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    min-height: 1rem;
    letter-spacing: 0.025em;
  }
  
  .legend {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    border: 1px solid hsl(214.3 31.8% 91.4%);
  }
  
  .legend-color.instruction {
    background: linear-gradient(135deg, hsl(220 70% 96%), hsl(220 70% 93%));
    border-color: hsl(220 70% 85%);
  }
  
  .legend-color.data {
    background: hsl(210 40% 98%);
    border-color: hsl(214.3 31.8% 91.4%);
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

  .instruction-label {
    font-size: 0.5rem;
    color: hsl(220 70% 40%);
    font-weight: 700;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    text-align: center;
    line-height: 1;
    margin-top: 0.25rem;
    background: hsl(220 70% 95%);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
</style> 