<script>
  import { createEventDispatcher } from 'svelte';
  
  export let cpuState;
  
  const dispatch = createEventDispatcher();
  
  let code = `LOAD A, 10
LOAD B, 20
ADD A, B
STORE A, 100
HALT`;
  
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
</script>

<div class="control-panel">
  <div class="connection-status" class:connected={cpuState.connected}>
    <div class="status-indicator" class:connected={cpuState.connected}></div>
    <span class="status-text">{cpuState.connected ? '연결됨' : '연결 안됨'}</span>
  </div>
  
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">어셈블리 코드</h3>
    </div>
    <div class="card-content">
      <textarea 
        bind:value={code}
        placeholder="어셈블리 명령어를 입력하세요..."
        rows="8"
        class="code-textarea"
      ></textarea>
      <button on:click={loadProgram} class="btn btn-secondary">프로그램 로드</button>
    </div>
  </div>
  
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">실행 제어</h3>
    </div>
    <div class="card-content">
      <div class="controls">
        <button 
          on:click={() => handleCommand('run')} 
          class="btn btn-primary"
          disabled={!cpuState.connected}
        >
          {isRunning ? '정지' : '실행'}
        </button>
        <button 
          on:click={() => handleCommand('step')}
          class="btn btn-outline"
          disabled={!cpuState.connected}
        >
          단계 실행
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
      <h3 class="card-title">실행 속도</h3>
    </div>
    <div class="card-content">
      <div class="speed-control">
        <input 
          type="range" 
          bind:value={speed}
          on:change={handleSpeedChange}
          min="100" 
          max="2000" 
          step="100"
          class="speed-slider"
        />
        <span class="speed-value">{speed}ms</span>
      </div>
    </div>
  </div>
  
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">상태</h3>
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
  }
  
  .status-indicator.connected {
    background: hsl(142.1 76.2% 36.3%);
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
  
  .code-textarea {
    width: 100%;
    min-height: 160px;
    padding: 0.75rem;
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.375rem;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.875rem;
    line-height: 1.25rem;
    background: hsl(0 0% 100%);
    color: hsl(222.2 84% 4.9%);
    resize: vertical;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    margin-bottom: 1rem;
  }
  
  .code-textarea:focus {
    outline: none;
    border-color: hsl(221.2 83.2% 53.3%);
    box-shadow: 0 0 0 2px hsl(221.2 83.2% 53.3% / 0.2);
  }
  
  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
    border: 1px solid transparent;
    padding: 0.5rem 1rem;
    cursor: pointer;
    min-height: 2.25rem;
  }
  
  .btn:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  
  .btn-primary {
    background: hsl(221.2 83.2% 53.3%);
    color: hsl(210 40% 98%);
  }
  
  .btn-primary:hover:not(:disabled) {
    background: hsl(221.2 83.2% 53.3% / 0.9);
  }
  
  .btn-secondary {
    background: hsl(210 40% 98%);
    color: hsl(222.2 84% 4.9%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
  }
  
  .btn-secondary:hover:not(:disabled) {
    background: hsl(210 40% 96%);
  }
  
  .btn-outline {
    background: transparent;
    color: hsl(222.2 84% 4.9%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
  }
  
  .btn-outline:hover:not(:disabled) {
    background: hsl(210 40% 98%);
  }
  
  .speed-control {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .speed-slider {
    flex: 1;
    height: 1.25rem;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
  }
  
  .speed-slider::-webkit-slider-track {
    height: 0.5rem;
    background: hsl(214.3 31.8% 91.4%);
    border-radius: 0.25rem;
  }
  
  .speed-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 1.25rem;
    width: 1.25rem;
    border-radius: 50%;
    background: hsl(221.2 83.2% 53.3%);
    cursor: pointer;
    border: 2px solid hsl(0 0% 100%);
    box-shadow: 0 1px 2px 0 hsl(0 0% 0% / 0.1);
  }
  
  .speed-slider::-moz-range-track {
    height: 0.5rem;
    background: hsl(214.3 31.8% 91.4%);
    border-radius: 0.25rem;
    border: none;
  }
  
  .speed-slider::-moz-range-thumb {
    height: 1.25rem;
    width: 1.25rem;
    border-radius: 50%;
    background: hsl(221.2 83.2% 53.3%);
    cursor: pointer;
    border: 2px solid hsl(0 0% 100%);
    box-shadow: 0 1px 2px 0 hsl(0 0% 0% / 0.1);
  }
  
  .speed-value {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(215.4 16.3% 46.9%);
    min-width: 3.5rem;
    text-align: right;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  }
  
  .status-grid {
    display: flex;
    flex-direction: column;
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
    color: hsl(215.4 16.3% 46.9%);
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .value {
    color: hsl(222.2 84% 4.9%);
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: right;
    max-width: 60%;
    word-break: break-all;
  }
</style> 