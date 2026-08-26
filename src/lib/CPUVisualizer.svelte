<script>
  import RegisterView from './RegisterView.svelte';
  import MemoryGrid from './MemoryGrid.svelte';
  import ALUDisplay from './ALUDisplay.svelte';
  import ControlUnit from './ControlUnit.svelte';
  
  export let cpuState;
</script>

<div class="cpu-visualizer">
  <div class="left-column">
    <ControlUnit
      pc={cpuState.pc}
      instruction={cpuState.inst}
    />
    <ALUDisplay
      operation={cpuState.alu}
    />
  </div>

  <div class="right-column">
    <RegisterView
      registers={cpuState.registers}
    />
  </div>

  <MemoryGrid
    memory={cpuState.memory}
  />
</div>

<style>
  .cpu-visualizer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
    gap: 1.5rem;
    height: 100%;
  }

  .left-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .right-column {
    display: flex;
    flex-direction: column;
  }

  /* 레지스터가 왼쪽 열(제어장치+ALU) 높이에 맞춤 */
  .right-column :global(.card) {
    flex: 1;
  }

  @media (max-width: 1025px) {
    .cpu-visualizer {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(3, auto);
    }
  }
</style> 