export default class MockCPU {
  constructor() {
    this.state = {
      pc: 0,
      registers: { A: 0, B: 0, C: 0, D: 0 },
      memory: new Array(256).fill(0),
      alu: '대기 중...',
      inst: '-',
      connected: true
    };
    
    this.program = [
      'LOAD A, 10',
      'LOAD B, 20', 
      'ADD A, B',
      'STORE A, 100',
      'LOAD C, 5',
      'MUL A, C',
      'STORE A, 101',
      'HALT'
    ];
    
    this.isRunning = false;
    this.speed = 1000;
    this.callbacks = {};
  }
  
  setCallbacks(callbacks) {
    this.callbacks = callbacks;
  }
  
  start() {
    this.isRunning = true;
    this.runLoop();
  }
  
  stop() {
    this.isRunning = false;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
  
  step() {
    if (this.state.pc >= this.program.length) {
      this.state.pc = 0;
      this.state.inst = '-';
      this.state.alu = '대기 중...';
      this.notifyStateChange();
      return;
    }
    
    const instruction = this.program[this.state.pc];
    this.executeInstruction(instruction);
    this.state.pc++;
    this.notifyStateChange();
  }
  
  reset() {
    this.state = {
      pc: 0,
      registers: { A: 0, B: 0, C: 0, D: 0 },
      memory: new Array(256).fill(0),
      alu: '대기 중...',
      inst: '-',
      connected: true
    };
    this.isRunning = false;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.notifyStateChange();
  }
  
  setSpeed(speed) {
    this.speed = speed;
  }
  
  executeInstruction(instruction) {
    const parts = instruction.split(/[,\s]+/).map(p => p.trim());
    const cmd = parts[0].toUpperCase();
    
    this.state.inst = instruction;
    
    switch (cmd) {
      case 'LOAD':
        this.state.registers[parts[1]] = parseInt(parts[2]);
        break;
        
      case 'STORE':
        const addr = parseInt(parts[2]);
        this.state.memory[addr] = this.state.registers[parts[1]];
        break;
        
      case 'ADD':
        this.state.alu = `${this.state.registers[parts[1]]} + ${this.state.registers[parts[2]]}`;
        this.state.registers[parts[1]] += this.state.registers[parts[2]];
        setTimeout(() => {
          this.state.alu = '대기 중...';
          this.notifyStateChange();
        }, 800);
        break;
        
      case 'SUB':
        this.state.alu = `${this.state.registers[parts[1]]} - ${this.state.registers[parts[2]]}`;
        this.state.registers[parts[1]] -= this.state.registers[parts[2]];
        setTimeout(() => {
          this.state.alu = '대기 중...';
          this.notifyStateChange();
        }, 800);
        break;
        
      case 'MUL':
        this.state.alu = `${this.state.registers[parts[1]]} × ${this.state.registers[parts[2]]}`;
        this.state.registers[parts[1]] *= this.state.registers[parts[2]];
        setTimeout(() => {
          this.state.alu = '대기 중...';
          this.notifyStateChange();
        }, 800);
        break;
        
      case 'MOV':
        this.state.registers[parts[1]] = this.state.registers[parts[2]];
        break;
        
      case 'HALT':
        this.state.inst = 'HALT - 프로그램 종료';
        this.isRunning = false;
        break;
        
      default:
        this.state.inst = `알 수 없는 명령어: ${cmd}`;
    }
  }
  
  runLoop() {
    if (!this.isRunning) return;
    
    this.step();
    
    if (this.isRunning) {
      this.timeout = setTimeout(() => {
        this.runLoop();
      }, this.speed);
    }
  }
  
  notifyStateChange() {
    if (this.callbacks.onState) {
      this.callbacks.onState(this.state);
    }
  }
  
  getState() {
    return { ...this.state };
  }
} 