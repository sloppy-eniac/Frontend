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
  
  // 명령어 영역 판별 - 정확한 명령어 영역만 감지
  function isInstructionArea(index) {
    // 연속된 명령어 영역의 끝을 찾기 (명령어는 연속적으로 배치됨)
    let instructionEnd = -1;
    
    // 처음부터 시작해서 연속된 명령어 영역의 끝을 찾기
    for (let i = 0; i < memory.length - 1; i += 2) {
      if (memory[i] !== 0 || memory[i + 1] !== 0) {
        // 유효한 명령어인지 확인 (opcode가 0-4 범위)
        const instruction = (memory[i] << 8) | memory[i + 1];
        const opcode = (instruction >> 12) & 0xF;
        if (opcode <= 4) { // ADD, SUB, MUL, DIV, MOV
          instructionEnd = i + 1;
        } else {
          // 유효하지 않은 opcode가 나오면 명령어 영역 끝
          break;
        }
      } else {
        // 빈 바이트가 나오면 명령어 영역 끝
        break;
      }
    }
    
    // 명령어 영역 범위 내에서만 true 반환
    return index <= instructionEnd;
  }

  // MOV로 변경된 데이터 영역 판별
  function isMovDataArea(index) {
    // 명령어 영역이 아니고, 값이 0이 아닌 경우 MOV로 변경된 데이터로 간주
    if (isInstructionArea(index)) return false;
    return memory[index] !== 0;
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
    const reg1 = (instruction >> 4) & 0xFF;
    const reg2 = instruction & 0xF;
    
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
          <div class="legend-color mov-data"></div>
          <span>MOV 데이터</span>
        </div>
        <div class="legend-item">
          <div class="legend-color data"></div>
          <span>빈 영역</span>
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
          class:mov-data-area={isMovDataArea(index)}
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
    background: linear-gradient(135deg, hsl(220 90% 92%), hsl(220 90% 88%));
    border-color: hsl(220 90% 75%);
    box-shadow: 0 2px 4px 0 hsl(220 90% 75% / 0.4);
  }
  
  .memory-cell.instruction-area:hover {
    background: linear-gradient(135deg, hsl(220 90% 90%), hsl(220 90% 86%));
    border-color: hsl(220 90% 70%);
    transform: scale(1.05);
  }
  
  .memory-cell.instruction-area .address {
    color: hsl(220 90% 35%);
    font-weight: 600;
  }
  
  .memory-cell.instruction-area .value {
    color: hsl(220 90% 20%);
    font-weight: 700;
  }

  .memory-cell.mov-data-area {
    background: linear-gradient(135deg, hsl(142 76% 92%), hsl(142 76% 88%));
    border-color: hsl(142 76% 75%);
    box-shadow: 0 2px 4px 0 hsl(142 76% 75% / 0.4);
  }
  
  .memory-cell.mov-data-area:hover {
    background: linear-gradient(135deg, hsl(142 76% 90%), hsl(142 76% 86%));
    border-color: hsl(142 76% 70%);
    transform: scale(1.05);
  }
  
  .memory-cell.mov-data-area .address {
    color: hsl(142 76% 35%);
    font-weight: 600;
  }
  
  .memory-cell.mov-data-area .value {
    color: hsl(142 76% 20%);
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
    background: linear-gradient(135deg, hsl(220 90% 92%), hsl(220 90% 88%));
    border-color: hsl(220 90% 75%);
  }
  
  .legend-color.mov-data {
    background: linear-gradient(135deg, hsl(142 76% 92%), hsl(142 76% 88%));
    border-color: hsl(142 76% 75%);
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