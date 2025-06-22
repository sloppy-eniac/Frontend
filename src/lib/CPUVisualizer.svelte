<script>
  import RegisterView from './RegisterView.svelte';
  import MemoryGrid from './MemoryGrid.svelte';
  import ALUDisplay from './ALUDisplay.svelte';
  import ControlUnit from './ControlUnit.svelte';
  
  export let cpuState;
</script>

<div class="cpu-visualizer">
  <ControlUnit 
    pc={cpuState.pc}
    instruction={cpuState.inst}
  />
  
  <RegisterView 
    registers={cpuState.registers}
  />
  
  <ALUDisplay 
    operation={cpuState.alu}
  />
  
  <MemoryGrid 
    memory={cpuState.memory}
  />
</div>

<style>
  .cpu-visualizer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto 1fr;
    gap: 1.5rem;
    height: 100%;
  }
  
  @media (max-width: 1025px) {
    .cpu-visualizer {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(4, auto);
    }
  }
</style> 