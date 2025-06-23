<script>
  import { createEventDispatcher } from 'svelte';
  
  export let cpuState;
  export let errorMessages = [];
  
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
  
  // 🚀 테스트 시나리오 함수들
  async function runFullTest() {
    try {
      await cpuClient.reset();
      console.log('🎯 전체 테스트 시작');
      
      // 1. MOV R4, 32
      await cpuClient.executeAssembly('MOV R4, 32');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 2. MOV R2, 50  
      await cpuClient.executeAssembly('MOV R2, 50');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 3. ADD R4, R2
      await cpuClient.executeAssembly('ADD R4, R2');
      
      console.log('✅ 전체 테스트 완료');
    } catch (error) {
      console.error('❌ 전체 테스트 오류:', error);
    }
  }
  
  async function runAddTest() {
    try {
      await cpuClient.reset();
      console.log('🚀 ADD 테스트 시작');
      
      // R4 = 32, R2 = 50 설정 후 ADD
      await cpuClient.executeAssembly('MOV R4, 32');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await cpuClient.executeAssembly('MOV R2, 50');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await cpuClient.executeAssembly('ADD R4, R2');
      
      console.log('✅ ADD 테스트 완료 - 결과는 R7에 82가 저장되어야 함');
    } catch (error) {
      console.error('❌ ADD 테스트 오류:', error);
    }
  }
  
  async function runMathTest() {
    try {
      await cpuClient.reset();
      console.log('🧮 수학 연산 테스트 시작');
      
      // 다양한 연산 테스트
      await cpuClient.executeAssembly('MOV R1, 10');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await cpuClient.executeAssembly('MOV R2, 5');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await cpuClient.executeAssembly('ADD R1, R2');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await cpuClient.executeAssembly('SUB R1, R2');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await cpuClient.executeAssembly('MUL R1, R2');
      
      console.log('✅ 수학 연산 테스트 완료');
    } catch (error) {
      console.error('❌ 수학 연산 테스트 오류:', error);
    }
  }
  
  async function clearAll() {
    try {
      await cpuClient.reset();
      assemblyInput = '';
      console.log('🧹 전체 초기화 완료');
    } catch (error) {
      console.error('❌ 초기화 오류:', error);
    }
  }

  async function runUnderflowTest() {
    try {
      await cpuClient.reset();
      console.log('🚨 오버플로우 테스트 시작 (양수 - 음수)');
      
      // R1 = 100 (양수), R2 = 200 (8비트에서는 -56) 설정 후 SUB
      await cpuClient.executeAssembly('MOV R1, 100');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await cpuClient.executeAssembly('MOV R2, 200');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await cpuClient.executeAssembly('SUB R1, R2');
      
      console.log('✅ 오버플로우 테스트 완료 - 양수에서 음수를 빼서 범위 초과, OF=1이 되어야 함');
    } catch (error) {
      console.error('❌ 오버플로우 테스트 오류:', error);
    }
  }

  async function runOverflowTest() {
    try {
      await cpuClient.reset();
      console.log('⚠️  오버플로우 테스트 시작 (양수 + 양수 = 음수)');
      
      // R3 = 100 (양수), R4 = 50 (양수) 설정 후 ADD
      await cpuClient.executeAssembly('MOV R3, 100');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await cpuClient.executeAssembly('MOV R4, 50');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await cpuClient.executeAssembly('ADD R3, R4');
      
      console.log('✅ 오버플로우 테스트 완료 - 양수+양수=음수로 부호 오버플로우, OF=1이 되어야 함');
    } catch (error) {
      console.error('❌ 오버플로우 테스트 오류:', error);
    }
  }
</script>

<div class="control-panel">
  <div class="connection-status" class:connected={cpuState.connected}>
    <div class="status-indicator" class:connected={cpuState.connected}></div>
    <span class="status-text">{cpuState.connected ? 'CPU 서버 연결됨' : 'CPU 서버 연결 안됨'}</span>
  </div>
  
  <!-- 에러 메시지 표시 영역 -->
  {#if errorMessages && errorMessages.length > 0}
    <div class="error-panel">
      <div class="error-header">
        <h3 class="error-title">🚨 오류/경고 메시지</h3>
        <button class="clear-errors-btn" on:click={() => dispatch('clearErrors')}>
          지우기
        </button>
      </div>
      <div class="error-messages">
        {#each errorMessages as message, index}
          <div class="error-message" class:warning={message.includes('⚠️')} class:error={message.includes('🚨')}>
            <span class="error-text">{message}</span>
            <span class="error-time">{new Date().toLocaleTimeString()}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
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
  
  <h3>🎯 명령어 예제</h3>
  <div class="examples">
    <button on:click={() => assemblyInput = 'MOV R4, 32'} class="example-btn">
      MOV R4, 32
    </button>
    <button on:click={() => assemblyInput = 'MOV R2, 50'} class="example-btn">
      MOV R2, 50
    </button>
    <button on:click={() => assemblyInput = 'ADD R4, R2'} class="example-btn">
      ADD R4, R2
    </button>
    <button on:click={() => assemblyInput = 'SUB R4, R2'} class="example-btn">
      SUB R4, R2
    </button>
    <button on:click={() => assemblyInput = 'MUL R4, R2'} class="example-btn">
      MUL R4, R2
    </button>
    <button on:click={() => assemblyInput = 'DIV R4, R2'} class="example-btn">
      DIV R4, R2
    </button>
    <button on:click={() => assemblyInput = 'MOV R1, 100'} class="example-btn">
      MOV R1, 100
    </button>
    <button on:click={() => assemblyInput = 'MOV R3, 255'} class="example-btn">
      MOV R3, 255
    </button>
  </div>
  
  <h3>🚀 테스트 시나리오</h3>
  <div class="test-scenarios">
    <button on:click={runFullTest} class="test-btn">
      전체 테스트 실행
    </button>
    <button on:click={runAddTest} class="test-btn">
      ADD 테스트 (R4+R2)
    </button>
    <button on:click={runMathTest} class="test-btn">
      수학 연산 테스트
    </button>
    <button on:click={runUnderflowTest} class="error-test-btn">
      🚨 오버플로우 테스트 (SUB)
    </button>
    <button on:click={runOverflowTest} class="error-test-btn">
      ⚠️ 오버플로우 테스트 (ADD)
    </button>
    <button on:click={clearAll} class="clear-btn">
      전체 초기화
    </button>
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
  
  .examples {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 1rem;
  }
  
  .example-btn {
    border: 1px solid #cfcfcf;
    color: rgb(140, 140, 140);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-family: 'Courier New', monospace;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .example-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  .test-scenarios {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 1rem;
  }
  
  .test-btn {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .test-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);
  }
  
  .clear-btn {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .clear-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  }

  .error-test-btn {
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
    color: #8b0000;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .error-test-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 154, 158, 0.3);
  }
  
  h3 {
    color: #2c3e50;
    margin: 1.5rem 0 0.8rem 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  h3:first-of-type {
    margin-top: 1rem;
  }

  /* 에러 패널 스타일 */
  .error-panel {
    background: hsl(0 100% 98%);
    border: 1px solid hsl(0 84% 60%);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
  }

  .error-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .error-title {
    color: hsl(0 84% 60%);
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }

  .clear-errors-btn {
    background: hsl(0 84% 60%);
    color: white;
    border: none;
    padding: 0.25rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .clear-errors-btn:hover {
    background: hsl(0 84% 55%);
  }

  .error-messages {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .error-message {
    padding: 0.75rem;
    border-radius: 0.375rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 0.875rem;
  }

  .error-message.warning {
    background: hsl(48 100% 96%);
    border: 1px solid hsl(48 96% 53%);
    color: hsl(25 95% 53%);
  }

  .error-message.error {
    background: hsl(0 100% 97%);
    border: 1px solid hsl(0 84% 60%);
    color: hsl(0 84% 60%);
  }

  .error-text {
    flex: 1;
  }

  .error-time {
    font-size: 0.75rem;
    opacity: 0.7;
    margin-left: 1rem;
  }

  .error-example {
    background: hsl(0 100% 98%) !important;
    border-color: hsl(0 84% 60%) !important;
    color: hsl(0 84% 60%) !important;
  }

  .error-example:hover {
    background: hsl(0 100% 95%) !important;
  }
</style> 