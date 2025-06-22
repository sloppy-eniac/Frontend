<script>
  export let pc = 0;
  export let instruction = '-';
  
  let previousPc = pc;
  let isExecuting = false;
  
  $: {
    if (pc !== previousPc) {
      isExecuting = true;
      setTimeout(() => {
        isExecuting = false;
      }, 800);
    }
    previousPc = pc;
  }
</script>

<div class="card" class:executing={isExecuting}>
  <div class="card-header">
    <h3 class="card-title">제어장치</h3>
  </div>
  <div class="card-content">
    <div class="status-group">
      <div class="status-item">
        <div class="label">프로그램 카운터 (PC)</div>
        <div class="pc-value" class:updating={isExecuting}>{pc}</div>
      </div>
      
      <div class="status-item">
        <div class="label">현재 명령어</div>
        <div class="instruction-value">{instruction}</div>
      </div>
    </div>
    
    <div class="execution-indicator" class:active={isExecuting}>
      <div class="indicator-light" class:active={isExecuting}></div>
      <span class="status-text">{isExecuting ? '실행 중' : '대기'}</span>
    </div>
  </div>
</div>

<style>
  .card {
    background: hsl(0 0% 100%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 hsl(0 0% 0% / 0.05);
    transition: all 0.3s ease;
    position: relative;
  }
  
  .card.executing {
    border-color: hsl(142.1 76.2% 36.3%);
    box-shadow: 0 0 0 2px hsl(142.1 76.2% 36.3% / 0.2);
    animation: controlPulse 0.8s ease-out;
  }
  
  @keyframes controlPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.01); }
    100% { transform: scale(1); }
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
  
  .status-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .status-item {
    background: hsl(210 40% 98%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.375rem;
    padding: 1rem;
    text-align: center;
  }
  
  .label {
    color: hsl(215.4 16.3% 46.9%);
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  .pc-value {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 1.875rem;
    font-weight: 700;
    color: hsl(142.1 76.2% 36.3%);
    background: hsl(0 0% 100%);
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
    border: 1px solid hsl(214.3 31.8% 91.4%);
    display: inline-block;
    min-width: 4rem;
    transition: all 0.3s ease;
  }
  
  .pc-value.updating {
    background: hsl(142.1 76.2% 36.3% / 0.1);
    border-color: hsl(142.1 76.2% 36.3%);
    color: hsl(142.1 76.2% 36.3%);
    transform: scale(1.05);
    box-shadow: 0 0 0 2px hsl(142.1 76.2% 36.3% / 0.2);
  }
  
  .instruction-value {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(222.2 84% 4.9%);
    background: hsl(0 0% 100%);
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
    border: 1px solid hsl(214.3 31.8% 91.4%);
    min-height: 2.5rem;
    word-break: break-all;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .execution-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: hsl(210 40% 98%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
    border-radius: 0.375rem;
    font-weight: 500;
    color: hsl(215.4 16.3% 46.9%);
    transition: all 0.3s ease;
  }
  
  .execution-indicator.active {
    color: hsl(142.1 76.2% 36.3%);
    background: hsl(142.1 76.2% 36.3% / 0.1);
    border-color: hsl(142.1 76.2% 36.3%);
  }
  
  .indicator-light {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background: hsl(215.4 16.3% 46.9%);
    transition: all 0.3s ease;
  }
  
  .indicator-light.active {
    background: hsl(142.1 76.2% 36.3%);
    box-shadow: 0 0 8px hsl(142.1 76.2% 36.3% / 0.6);
    animation: blink 0.8s ease-in-out;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  
  .status-text {
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .card.executing::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.25rem;
    background: linear-gradient(90deg, hsl(142.1 76.2% 36.3%), hsl(142.1 76.2% 36.3% / 0.5), hsl(142.1 76.2% 36.3%));
    background-size: 200% 100%;
    animation: progress 0.8s ease-out;
    border-radius: 0.5rem 0.5rem 0 0;
  }
  
  @keyframes progress {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style> 