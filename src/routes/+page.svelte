<script>
  import { onMount } from 'svelte';
  import CPUClient from '$lib/CPUClient.js';
  import CPUVisualizer from '$lib/CPUVisualizer.svelte';
  import ControlPanel from '$lib/ControlPanel.svelte';
  
  let cpuState = {
    pc: 0,
    registers: { 
      register1: 0, 
      register2: 0, 
      register3: 0,
      register4: 0,
      register5: 0,
      register6: 0,
      register7: 0
    },
    memory: new Array(256).fill(0),
    cache: [],
    alu: '대기 중...',
    inst: '-',
    connected: false,
    isRunning: false,
    lastAssembly: '',
    decodedBytes: []
  };
  
  let cpuClient;
  
  onMount(() => {
    // 기존 인스턴스가 있으면 해제
    if (window.cpuClientInstance) {
      window.cpuClientInstance.disconnect();
    }
    
    cpuClient = new CPUClient();
    window.cpuClientInstance = cpuClient;
    cpuClient.setCallbacks({
      onState: (state) => {
        cpuState = { ...state };
      },
      onError: (error) => {
        console.error('CPU 오류:', error);
        // 에러 표시 UI 추가 가능
      }
    });
    
    // 초기 상태 로드
    cpuState = cpuClient.getState();
    
    return () => {
      cpuClient?.disconnect();
      if (window.cpuClientInstance === cpuClient) {
        window.cpuClientInstance = null;
      }
    };
  });
  
  function handleCommand(event) {
    const command = event.detail;
    
    if (typeof command === 'string') {
      switch (command) {
        case 'step':
          // 단계 실행
          if (cpuClient) {
            const success = cpuClient.stepExecution();
            if (success) {
              console.log('단계 실행 요청 전송');
            } else {
              console.error('단계 실행 실패 - CPU 서버 연결을 확인하세요');
            }
          }
          break;
        case 'reset':
          if (cpuClient) {
            cpuClient.reset();
            console.log('CPU 리셋 요청 전송');
          }
          break;
      }
    } else if (command.action === 'load') {
      // 프로그램 로드 기능
      console.log('프로그램 로드:', command.code);
      if (cpuClient && command.code) {
        const success = cpuClient.loadProgram(command.code);
        if (success) {
          console.log('프로그램 로드 성공');
        } else {
          console.error('프로그램 로드 실패 - CPU 서버 연결을 확인하세요');
        }
      }
    } else if (command.action === 'run_all') {
      // 전체 프로그램 실행
      if (cpuClient) {
        const success = cpuClient.runAllProgram();
        if (success) {
          console.log('전체 프로그램 실행 시작');
        } else {
          console.error('전체 프로그램 실행 실패 - CPU 서버 연결을 확인하세요');
        }
      }
    }
  }
  
  function handleAssemblyCommand(event) {
    const assemblyCode = event.detail;
    if (cpuClient) {
      cpuClient.executeAssembly(assemblyCode);
    }
  }
</script>

<main>
  <div class="container">
    <header class="header">
      <h1>CPU 시뮬레이터</h1>
      <p class="subtitle">실시간 CPU 명령어 실행 및 상태 모니터링</p>
    </header>
    
    <div class="layout">
      <ControlPanel 
        {cpuState}
        on:command={handleCommand}
        on:assembly={handleAssemblyCommand}
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
