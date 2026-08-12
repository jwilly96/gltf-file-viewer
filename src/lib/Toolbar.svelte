<script>
  import '../app.css';
  let { modelLoaded, onFileChange, sampleModels = [], onSampleLoad } = $props();
</script>

<div class="toolbar box">
  <h1>GLB Viewer</h1>
  <label class="upload-btn box">
    Upload .glb file
    <input type="file" accept=".glb" onchange={onFileChange} />
  </label>
  {#if sampleModels.length > 0}
    <select
      class="sample-select box"
      onchange={e => { if (e.target.value) { onSampleLoad(e.target.value); e.target.value = ''; } }}
    >
      <option value="">Sample Models</option>
      {#each sampleModels as model}
        <option value={model.url}>{model.name}</option>
      {/each}
    </select>
  {/if}
  {#if !modelLoaded}
    <p class="hint">No model loaded — upload a .glb file to get started</p>
  {/if}
</div>

<style>
  .toolbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.6rem 1rem;
    flex-shrink: 0;
    z-index: 10;
  }

  h1 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-h);
  }

  .upload-btn {
    cursor: pointer;
    padding: 0.4rem 0.9rem;
    box-sizing: border-box;
  }

  .upload-btn:hover {
    box-shadow: var(--shadow);
  }

  .upload-btn input {
    display: none;
  }

  .sample-select {
    cursor: pointer;
    padding: 0.4rem 0.9rem;
  }

  .hint {
    margin: 0;
    font-size: 0.85rem;
  }
</style>
