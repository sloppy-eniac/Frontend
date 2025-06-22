<script>
  import { onMount } from 'svelte';
  import MockCPU from '$lib/MockCPU.js';
  import CPUVisualizer from '$lib/CPUVisualizer.svelte';
  import ControlPanel from '$lib/ControlPanel.svelte';
  
  let cpuState = {
    pc: 0,
    registers: { A: 0, B: 0, C: 0, D: 0 },
    memory: new Array(256).fill(0),
    alu: '대기 중...',
    inst: '-',
    connected: true
  };
  
  let mockCPU;
  
  onMount(() => {
    mockCPU = new MockCPU();
    mockCPU.setCallbacks({
      onState: (state) => {
        cpuState = { ...state };
      }
    });
    
    // 초기 상태 로드
    cpuState = mockCPU.getState();
    
    return () => {
      mockCPU?.stop();
    };
  });
  
  function handleCommand(event) {
    const command = event.detail;
    
    switch (command) {
      case 'run':
        if (mockCPU.isRunning) {
          mockCPU.stop();
        } else {
          mockCPU.start();
        }
        break;
      case 'step':
        mockCPU.step();
        break;
      case 'reset':
        mockCPU.reset();
        break;
    }
  }
  
  function handleSpeed(event) {
    const speed = event.detail;
    mockCPU?.setSpeed(speed);
  }
</script>

<main>
  <div class="container">
    <header class="header">
      <h1>CPU 시뮬레이터</h1>
    </header>
    
    <div class="layout">
      <ControlPanel 
        {cpuState}
        on:command={handleCommand}
        on:speed={handleSpeed}
      />
      
      <CPUVisualizer {cpuState} />
    </div>
  </div>
</main>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background: hsl(0 0% 98%);
    color: hsl(222.2 84% 4.9%);
    line-height: 1.5;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid hsl(214.3 31.8% 91.4%);
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    color: hsl(222.2 84% 4.9%);
    margin-bottom: 0.5rem;
    letter-spacing: -0.025em;
  }

  .subtitle {
    color: hsl(215.4 16.3% 46.9%);
    font-size: 1.125rem;
    font-weight: 400;
  }

  .layout {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 2rem;
    height: calc(100vh - 200px);
  }

  @media (max-width: 1200px) {
    .layout {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .container {
      padding: 1rem;
    }
    
    h1 {
      font-size: 2rem;
    }
  }
</style>
