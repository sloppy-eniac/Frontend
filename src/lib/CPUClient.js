import WebSocketManager from './WebSocketManager.js';

export default class CPUClient {
  constructor() {
    this.wsManager = null;
    this.callbacks = {};
    this.isConnecting = false;
    this.cpuState = {
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
      alu: '대기 중...',
      inst: '-',
      connected: false,
      isRunning: false,
      lastAssembly: '',
      decodedBytes: []
    };
    
    this.connect();
  }
  
  connect() {
    // 이미 연결 중이거나 연결된 경우 중복 연결 방지
    if (this.isConnecting || (this.wsManager && this.wsManager.isConnected())) {
      console.log('이미 연결 중이거나 연결됨 - 중복 연결 방지');
      return;
    }
    
    this.isConnecting = true;
    
    // WebSocket URL (로컬 CPU 서버)
    const wsUrl = 'ws://localhost:8080';
    
    this.wsManager = new WebSocketManager(wsUrl, {
      onConnect: () => {
        console.log('CPU 서버에 연결됨');
        this.isConnecting = false;
        this.cpuState.connected = true;
        this.notifyStateChange();
        
        // 연결 후 초기 상태 요청
        setTimeout(() => {
          this.requestAllStates();
        }, 500);
      },
      
      onDisconnect: () => {
        console.log('CPU 서버 연결 끊어짐');
        this.isConnecting = false;
        this.cpuState.connected = false;
        this.notifyStateChange();
      },
      
      onState: (payload) => {
        this.updateCPUState(payload);
      },
      
      onMemory: (payload) => {
        this.updateMemoryState(payload);
      },
      
      onExecution: (payload) => {
        this.handleExecutionStep(payload);
      },
      
      onAck: (message) => {
        console.log('서버 응답:', message);
      },
      
      onError: (error) => {
        console.error('CPU 서버 오류:', error);
        this.callbacks.onError?.(error);
      }
    });
  }
  
  updateCPUState(state) {
    this.cpuState.pc = state.pc || 0;
    this.cpuState.registers.register1 = state.register1 || 0;
    this.cpuState.registers.register2 = state.register2 || 0;
    this.cpuState.registers.register3 = state.register3 || 0;
    this.cpuState.registers.register4 = state.register4 || 0;
    this.cpuState.registers.register5 = state.register5 || 0;
    this.cpuState.registers.register6 = state.register6 || 0;
    this.cpuState.registers.register7 = state.register7 || 0;
    
    this.notifyStateChange();
  }
  
  updateMemoryState(memoryData) {
    if (memoryData.data && Array.isArray(memoryData.data)) {
      // 받은 메모리 데이터로 업데이트
      for (let i = 0; i < memoryData.data.length && i < this.cpuState.memory.length; i++) {
        this.cpuState.memory[i] = memoryData.data[i];
      }
      this.notifyStateChange();
    }
  }
  

  
  handleExecutionStep(executionData) {
    if (executionData.instruction) {
      // 명령어 정보 파싱
      const instructionText = executionData.instruction;
      
      // "실행: ADD 5, 10 | PC: 0 -> 2" 형태에서 명령어 부분만 추출
      let actualInstruction = instructionText;
      if (instructionText.includes('실행:')) {
        const match = instructionText.match(/실행:\s*([^|]+)/);
        if (match) {
          actualInstruction = match[1].trim();
        }
      }
      
      this.cpuState.lastAssembly = actualInstruction;
      this.cpuState.inst = actualInstruction;
      this.cpuState.alu = `🔄 실행: ${actualInstruction}`;
      
      console.log('명령어 실행:', instructionText);
    }
    
    if (executionData.bytes) {
      this.cpuState.decodedBytes = executionData.bytes;
    }
    
    this.notifyStateChange();
    
    // 실행 완료 후 잠시 후 대기 상태로 변경
    setTimeout(() => {
      this.cpuState.alu = '⏸️ 다음 단계 대기 중...';
      this.notifyStateChange();
    }, 1500);
  }
  
  notifyStateChange() {
    this.callbacks.onState?.(this.cpuState);
  }
  
  setCallbacks(callbacks) {
    this.callbacks = callbacks;
  }
  
  // 어셈블리 코드 전송
  sendAssemblyCode(assemblyCode) {
    if (!this.wsManager || !this.wsManager.isConnected()) {
      console.warn('CPU 서버에 연결되지 않음');
      return false;
    }
    
    this.wsManager.send({
      type: 'assembly',
      payload: assemblyCode
    });
    
    return true;
  }
  
  // 프로그램 로드 (여러 줄의 어셈블리 코드)
  loadProgram(assemblyCode) {
    if (!this.wsManager || !this.wsManager.isConnected()) {
      console.warn('CPU 서버에 연결되지 않음');
      return false;
    }
    
    console.log('프로그램 로드 중:', assemblyCode);
    
    // 프로그램 로드 메시지 전송
    this.wsManager.send({
      type: 'load_program',
      payload: assemblyCode
    });
    
    // ALU 상태 업데이트
    this.cpuState.alu = '프로그램 로드 중...';
    this.notifyStateChange();
    
    // 상태 새로고침 요청
    setTimeout(() => {
      this.requestAllStates();
    }, 1000);
    
    // 잠시 후 상태 업데이트
    setTimeout(() => {
      this.cpuState.alu = '프로그램 로드 완료';
      this.notifyStateChange();
      
      setTimeout(() => {
        this.cpuState.alu = '대기 중...';
        this.notifyStateChange();
      }, 1500);
    }, 500);
    
    return true;
  }
  
  // CPU 리셋
  reset() {
    if (!this.wsManager || !this.wsManager.isConnected()) {
      console.warn('CPU 서버에 연결되지 않음 - 로컬 리셋 실행');
      // 로컬 상태만 리셋
      this.cpuState.pc = 0;
      this.cpuState.registers = { 
        register1: 0, 
        register2: 0, 
        register3: 0,
        register4: 0,
        register5: 0,
        register6: 0,
        register7: 0
      };
      this.cpuState.memory.fill(0);
      this.cpuState.alu = '대기 중...';
      this.cpuState.inst = '-';
      this.cpuState.lastAssembly = '';
      this.cpuState.decodedBytes = [];
      
      this.notifyStateChange();
      return;
    }
    
    // 서버에 리셋 명령 전송
    this.wsManager.send({
      type: 'reset'
    });
    
    this.cpuState.alu = '리셋 중...';
    this.notifyStateChange();
  }

  // 단계별 실행
  stepExecution() {
    if (!this.wsManager || !this.wsManager.isConnected()) {
      console.warn('CPU 서버에 연결되지 않음');
      return false;
    }
    
    console.log('단계 실행 요청');
    
    this.wsManager.send({
      type: 'step'
    });
    
    this.cpuState.alu = '단계 실행 중...';
    this.notifyStateChange();
    
    return true;
  }
  
  // 단일 명령어 실행
  executeAssembly(assemblyCode) {
    if (!this.wsManager || !this.wsManager.isConnected()) {
      console.warn('CPU 서버에 연결되지 않음');
      return false;
    }
    
    console.log('단일 명령어 실행:', assemblyCode);
    
    // 1. CPU 리셋 (이전 상태 초기화)
    this.wsManager.send({
      type: 'reset'
    });
    
    // 2. 단일 명령어를 메모리에 로드
    setTimeout(() => {
      this.wsManager.send({
        type: 'load_single_instruction',
        payload: assemblyCode
      });
    }, 100);
    
    // 3. 바로 한 단계 실행
    setTimeout(() => {
      this.wsManager.send({
        type: 'step'
      });
    }, 200);
    
    this.cpuState.alu = `실행 중: ${assemblyCode}`;
    this.notifyStateChange();
    
    return true;
  }
  
  // 전체 프로그램 일괄 실행
  runAllProgram() {
    if (!this.wsManager || !this.wsManager.isConnected()) {
      console.warn('CPU 서버에 연결되지 않음');
      return false;
    }
    
    console.log('전체 프로그램 실행 요청');
    
    this.wsManager.send({
      type: 'run_all'
    });
    
    this.cpuState.alu = '전체 프로그램 실행 중...';
    this.cpuState.isRunning = true;
    this.notifyStateChange();
    
    return true;
  }
  
  // 현재 상태 반환
  getState() {
    return { ...this.cpuState };
  }
  
  // 연결 상태 확인
  isConnected() {
    return this.cpuState.connected;
  }
  
  // 모든 상태 새로고침 요청
  requestAllStates() {
    if (!this.wsManager || !this.wsManager.isConnected()) {
      return false;
    }
    
    // CPU 상태, 메모리, 캐시 상태를 모두 요청
    this.wsManager.send({ type: 'get_state' });
    this.wsManager.send({ type: 'get_memory' });
    this.wsManager.send({ type: 'get_cache' });
    
    return true;
  }

  // 연결 해제
  disconnect() {
    if (this.wsManager) {
      this.wsManager.close();
      this.wsManager = null;
    }
    this.cpuState.connected = false;
    this.notifyStateChange();
  }
} 