<script>
  import { createEventDispatcher } from 'svelte';
  
  export let cpuState;
  
  const dispatch = createEventDispatcher();
  
  let code = `ADD 10, 20
MOV 30, 60
SUB 15, 5
MOV 25, 61
MUL 3, 4
MOV 36, 62
DIV 12, 3
MOV 33, 63
MOV 100, 50
MOV 200, 51`;
  
  let singleInstruction = 'ADD 5, 10';
  let speed = 1000;
  let isRunning = false;
  
  function handleCommand(command) {
    if (command === 'run') {
      isRunning = !isRunning;
    } else if (command === 'reset') {
      isRunning = false;
    }
    dispatch('command', command);
  }
  
  function handleSpeedChange() {
    dispatch('speed', speed);
  }
  
  function loadProgram() {
    dispatch('command', { action: 'load', code });
  }
  
  // 단일 어셈블리 명령어 실행
  function executeSingleInstruction() {
    if (singleInstruction.trim()) {
      console.log('🚀 단일 명령어 실행 버튼 클릭:', singleInstruction.trim());
      dispatch('assembly', singleInstruction.trim());
    }
  }
  
  // 일괄 실행 기능 추가
  function runAllProgram() {
    dispatch('command', { action: 'run_all' });
  }
  
  // 예제 명령어 설정
  function setExampleInstruction(instruction) {
    singleInstruction = instruction;
  }
</script>

<div class="control-panel">
  <div class="connection-status" class:connected={cpuState.connected}>
    <div class="status-indicator" class:connected={cpuState.connected}></div>
    <span class="status-text">{cpuState.connected ? 'CPU 서버 연결됨' : 'CPU 서버 연결 안됨'}</span>
  </div>
  
  <!-- 단일 명령어 실행 -->
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">단일 명령어 실행</h3>
    </div>
    <div class="card-content">
      <div class="instruction-input">
        <input 
          type="text" 
          bind:value={singleInstruction}
          placeholder="예: ADD 5, 10"
          class="instruction-field"
        />
        <button 
          on:click={executeSingleInstruction}
          class="btn btn-primary"
          disabled={!cpuState.connected || !singleInstruction.trim()}
        >
          실행
        </button>
      </div>
      
      <div class="example-instructions">
        <h4>예제 명령어:</h4>
        <div class="example-buttons">
          <button class="example-btn" on:click={() => setExampleInstruction('MOV R4, 32')}>MOV R4, 32</button>
          <button class="example-btn" on:click={() => setExampleInstruction('MOV R1, 100')}>MOV R1, 100</button>
          <button class="example-btn" on:click={() => setExampleInstruction('MOV R2, 50')}>MOV R2, 50</button>
          <button class="example-btn" on:click={() => setExampleInstruction('ADD 5, 10')}>ADD 5, 10</button>
          <button class="example-btn" on:click={() => setExampleInstruction('SUB 15, 3')}>SUB 15, 3</button>
          <button class="example-btn" on:click={() => setExampleInstruction('MUL 4, 6')}>MUL 4, 6</button>
          <button class="example-btn" on:click={() => setExampleInstruction('DIV 20, 4')}>DIV 20, 4</button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">어셈블리 프로그램</h3>
    </div>
    <div class="card-content">
      <textarea 
        bind:value={code}
        placeholder="여러 어셈블리 명령어를 입력하세요..."
        rows="6"
        class="code-textarea"
      ></textarea>
      <button 
        on:click={loadProgram} 
        class="btn btn-secondary"
        disabled={!cpuState.connected}
      >
        프로그램 로드
      </button>
    </div>
  </div>
  
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">실행 제어</h3>
    </div>
    <div class="card-content">
      <div class="controls">
        <button 
          on:click={() => handleCommand('step')}
          class="btn btn-outline"
          disabled={!cpuState.connected}
        >
          단계 실행
        </button>
        <button 
          on:click={runAllProgram}
          class="btn btn-primary"
          disabled={!cpuState.connected}
        >
          전체 실행
        </button>
        <button 
          on:click={() => handleCommand('reset')}
          class="btn btn-outline"
          disabled={!cpuState.connected}
        >
          초기화
        </button>
      </div>
    </div>
  </div>
  
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">CPU 상태</h3>
    </div>
    <div class="card-content">
      <div class="status-grid">
        <div class="status-item">
          <span class="label">PC</span>
          <span class="value">{cpuState.pc}</span>
        </div>
        <div class="status-item">
          <span class="label">현재 명령어</span>
          <span class="value">{cpuState.inst}</span>
        </div>
        <div class="status-item">
          <span class="label">ALU 상태</span>
          <span class="value">{cpuState.alu}</span>
        </div>
        {#if cpuState.lastAssembly}
        <div class="status-item">
          <span class="label">마지막 실행</span>
          <span class="value">{cpuState.lastAssembly}</span>
        </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .control-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
    overflow-y: auto;
  }
  
  .connection-status {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: hsl(0 0% 100%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 hsl(0 0% 0% / 0.05);
  }
  
  .status-indicator {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: hsl(0 84.2% 60.2%);
    transition: background-color 0.2s ease;
    animation: pulse-red 2s infinite;
  }
  
  .status-indicator.connected {
    background: hsl(142.1 76.2% 36.3%);
    animation: pulse-green 2s infinite;
  }
  
  @keyframes pulse-red {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes pulse-green {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  .status-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(222.2 84% 4.9%);
  }
  
  .card {
    background: hsl(0 0% 100%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 hsl(0 0% 0% / 0.05);
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
  
  .instruction-input {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .instruction-field {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.375rem;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 0.875rem;
    background: hsl(0 0% 100%);
    transition: border-color 0.2s ease;
  }
  
  .instruction-field:focus {
    outline: none;
    border-color: hsl(221.2 83.2% 53.3%);
    box-shadow: 0 0 0 3px hsl(221.2 83.2% 53.3% / 0.1);
  }
  
  .example-instructions h4 {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(215.4 16.3% 46.9%);
    margin: 0 0 0.5rem 0;
  }
  
  .example-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .example-btn {
    padding: 0.25rem 0.5rem;
    background: hsl(210 40% 98%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.25rem;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 0.75rem;
    color: hsl(222.2 84% 4.9%);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .example-btn:hover {
    background: hsl(214.3 31.8% 91.4%);
  }
  
  .code-textarea {
    width: 100%;
    min-height: 120px;
    padding: 0.75rem;
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.375rem;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 0.875rem;
    line-height: 1.25rem;
    background: hsl(0 0% 100%);
    color: hsl(222.2 84% 4.9%);
    resize: vertical;
    transition: border-color 0.2s ease;
    margin-bottom: 1rem;
  }
  
  .code-textarea:focus {
    outline: none;
    border-color: hsl(221.2 83.2% 53.3%);
    box-shadow: 0 0 0 3px hsl(221.2 83.2% 53.3% / 0.1);
  }
  
  .controls {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-primary {
    background: hsl(221.2 83.2% 53.3%);
    color: hsl(210 40% 98%);
  }
  
  .btn-primary:hover:not(:disabled) {
    background: hsl(221.2 83.2% 48%);
  }
  
  .btn-secondary {
    background: hsl(215.4 16.3% 46.9%);
    color: hsl(210 40% 98%);
  }
  
  .btn-secondary:hover:not(:disabled) {
    background: hsl(215.4 16.3% 40%);
  }
  
  .btn-outline {
    background: hsl(0 0% 100%);
    border-color: hsl(214.3 31.8% 91.4%);
    color: hsl(222.2 84% 4.9%);
  }
  
  .btn-outline:hover:not(:disabled) {
    background: hsl(210 40% 98%);
    border-color: hsl(214.3 31.8% 85%);
  }
  
  .status-grid {
    display: grid;
    gap: 0.75rem;
  }
  
  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid hsl(214.3 31.8% 91.4%);
  }
  
  .status-item:last-child {
    border-bottom: none;
  }
  
  .label {
    font-size: 0.875rem;
    color: hsl(215.4 16.3% 46.9%);
    font-weight: 500;
  }
  
  .value {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 0.875rem;
    color: hsl(222.2 84% 4.9%);
    font-weight: 600;
  }
</style> 