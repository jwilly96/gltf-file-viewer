<script>
  import '../app.css';
  let { modelLoaded, onFileChange } = $props();
</script>

<div class="toolbar box">
  <h1>GLB Viewer</h1>
  <label class="upload-btn">
    Upload .glb file
    <input type="file" accept=".glb" onchange={onFileChange} />
  </label>
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
    background: var(--accent-bg);
    border-radius: 6px;
    border: 1px solid var(--accent-border);
    font-size: 0.9rem;
    transition: box-shadow 0.3s;
    box-sizing: border-box;
  }

  .upload-btn:hover {
    box-shadow: var(--shadow);
  }

  .upload-btn input {
    display: none;
  }

  .hint {
    margin: 0;
    font-size: 0.85rem;
  }
</style>
