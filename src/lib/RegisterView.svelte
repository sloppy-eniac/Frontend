<script>
  export let registers = { 
    register1: 0, 
    register2: 0, 
    register3: 0,
    register4: 0,
    register5: 0,
    register6: 0,
    register7: 0,
    overflow_flag: false  // OF 플래그 추가
  };
  
  let previousValues = { ...registers };
  let highlightedRegs = {};
  let highlightedFlags = {};
  
  // 레지스터 이름 매핑 (R7을 resultR로 변경)
  const registerNames = {
    register1: 'R1',
    register2: 'R2', 
    register3: 'R3',
    register4: 'R4',
    register5: 'R5',
    register6: 'R6',
    register7: 'resultR'  // R7을 resultR로 표시
  };
  
  $: {
    // 값 변경 감지 및 하이라이트
    Object.keys(registers).forEach(reg => {
              if (reg === 'overflow_flag') {
        if (registers[reg] !== previousValues[reg]) {
          highlightedFlags[reg] = true;
          setTimeout(() => {
            highlightedFlags[reg] = false;
            highlightedFlags = { ...highlightedFlags };
          }, 800);
        }
      } else if (registers[reg] !== previousValues[reg]) {
        highlightedRegs[reg] = true;
        setTimeout(() => {
          highlightedRegs[reg] = false;
          highlightedRegs = { ...highlightedRegs };
        }, 800);
      }
    });
    previousValues = { ...registers };
  }
</script>

<div class="card">
  <div class="card-header">
    <h3 class="card-title">레지스터</h3>
  </div>
  <div class="card-content">
    <div class="registers-grid">
      {#each Object.entries(registers) as [regKey, value]}
        {#if regKey !== 'overflow_flag'}
          <div 
            class="register-item" 
            class:highlight={highlightedRegs[regKey]}
            class:result-register={regKey === 'register7'}
          >
            <div class="register-name">{registerNames[regKey]}</div>
            <div class="register-value">{value}</div>
            <div class="register-info">{regKey === 'register7' ? '연산결과' : regKey}</div>
          </div>
        {/if}
      {/each}
    </div>
    
    <!-- 플래그 섹션 -->
    <!-- <div class="flags-section">
      <h4 class="flags-title">플래그 레지스터</h4>
      <div class="flags-grid">
        <div 
          class="flag-item" 
                class:highlight={highlightedFlags.overflow_flag}
      class:flag-set={registers.overflow_flag}
        >
                      <div class="flag-name">OF</div>
                      <div class="flag-value">{registers.overflow_flag ? '1' : '0'}</div>
                      <div class="flag-info">Overflow Flag</div>
            <div class="flag-description">
              {registers.overflow_flag ? '부호 있는 정수 오버플로우' : '정상'}
            </div>
        </div>
      </div>
    </div> -->
  </div>
</div>

<style>
  .card {
    background: hsl(0 0% 100%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 hsl(0 0% 0% / 0.05);
    transition: all 0.3s ease;
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
  
  .registers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  
  .register-item {
    background: hsl(210 40% 98%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.375rem;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  
  .register-item:hover {
    background: hsl(210 40% 96%);
  }
  
  .register-item.highlight {
    background: hsl(221.2 83.2% 53.3% / 0.1);
    border-color: hsl(221.2 83.2% 53.3%);
    transform: scale(1.02);
    box-shadow: 0 0 0 2px hsl(221.2 83.2% 53.3% / 0.2);
  }
  
  .register-item.highlight::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, hsl(221.2 83.2% 53.3% / 0.3), transparent);
    animation: shine 0.8s ease-out;
  }
  
  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  .register-name {
    font-weight: 600;
    color: hsl(221.2 83.2% 53.3%);
    font-size: 0.875rem;
  }
  
  .register-value {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 1.125rem;
    font-weight: 600;
    color: hsl(222.2 84% 4.9%);
    background: hsl(0 0% 100%);
    padding: 0.375rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid hsl(214.3 31.8% 91.4%);
    min-width: 2.5rem;
    text-align: center;
  }
  
  .register-info {
    font-size: 0.75rem;
    color: hsl(215.4 16.3% 46.9%);
    font-family: ui-monospace, SFMono-Regular, monospace;
  }
  
  .register-item.result-register {
    background: linear-gradient(135deg, hsl(120 100% 95%), hsl(120 100% 90%));
    border-color: hsl(120 100% 70%);
  }
  
  .register-item.result-register .register-name {
    color: hsl(120 100% 30%);
    font-weight: 700;
  }
  
  .register-item.result-register .register-value {
    border-color: hsl(120 100% 70%);
    background: hsl(120 100% 98%);
  }
  
  /* 플래그 섹션 스타일 */
  .flags-section {
    border-top: 1px solid hsl(214.3 31.8% 91.4%);
    padding-top: 1rem;
  }
  
  .flags-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(222.2 84% 4.9%);
    margin: 0 0 0.75rem 0;
  }
  
  .flags-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.75rem;
  }
  
  .flag-item {
    background: hsl(50 100% 98%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.375rem;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  
  .flag-item.flag-set {
    background: linear-gradient(135deg, hsl(0 100% 95%), hsl(0 100% 90%));
    border-color: hsl(0 100% 70%);
  }
  
  .flag-item.highlight {
    transform: scale(1.02);
    box-shadow: 0 0 0 2px hsl(50 100% 50% / 0.3);
  }
  
  .flag-item.highlight.flag-set {
    box-shadow: 0 0 0 2px hsl(0 100% 70% / 0.5);
  }
  
  .flag-item.highlight::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, hsl(50 100% 50% / 0.3), transparent);
    animation: shine 0.8s ease-out;
  }
  
  .flag-item.flag-set.highlight::before {
    background: linear-gradient(90deg, transparent, hsl(0 100% 70% / 0.3), transparent);
  }
  
  .flag-name {
    font-weight: 700;
    color: hsl(50 100% 30%);
    font-size: 0.875rem;
  }
  
  .flag-item.flag-set .flag-name {
    color: hsl(0 100% 30%);
  }
  
  .flag-value {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 1.125rem;
    font-weight: 600;
    color: hsl(222.2 84% 4.9%);
    background: hsl(0 0% 100%);
    padding: 0.375rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid hsl(214.3 31.8% 91.4%);
    min-width: 2rem;
    text-align: center;
  }
  
  .flag-item.flag-set .flag-value {
    background: hsl(0 100% 98%);
    border-color: hsl(0 100% 70%);
    color: hsl(0 100% 30%);
  }
  
  .flag-info {
    font-size: 0.75rem;
    color: hsl(215.4 16.3% 46.9%);
    font-family: ui-monospace, SFMono-Regular, monospace;
  }
  
  .flag-description {
    font-size: 0.6875rem;
    color: hsl(215.4 16.3% 56.9%);
    text-align: center;
    font-style: italic;
  }
  
  .flag-item.flag-set .flag-description {
    color: hsl(0 100% 40%);
    font-weight: 500;
  }
  
  @media (max-width: 640px) {
    .registers-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .flags-grid {
      grid-template-columns: 1fr;
    }
  }
</style> 