<script>
  import '../app.css';
  let {
    modelLoaded,
    stats,
    panelOpen = $bindable(true),
    wireframe = $bindable(false),
    vertexColors = $bindable(false),
    bgColor = $bindable('#1a1a2e'),
    autoRotate = $bindable(false),
    rotateSpeed = $bindable(1.0),
    onWireframeChange,
    onVertexColorsChange,
    onBgColorChange,
  } = $props();

  let activeTab = $state('options');
</script>

<div class="side-panel" class:open={panelOpen}>
  <button
    class="panel-toggle box"
    onclick={() => (panelOpen = !panelOpen)}
    title={panelOpen ? 'Collapse panel' : 'Expand panel'}
  >
    {panelOpen ? '◀' : '▶'}
  </button>

  {#if panelOpen}
    <div class="panel-inner box">
      <div class="tabs">
        <button class:active={activeTab === 'options'} onclick={() => (activeTab = 'options')}>Options</button>
        <button class:active={activeTab === 'stats'} onclick={() => (activeTab = 'stats')}>Statistics</button>
      </div>

      {#if activeTab === 'options'}
        <div class="tab-content">
          <label class="option-row">
            <input type="checkbox" bind:checked={wireframe} onchange={onWireframeChange} />
            Wireframe
          </label>
          <label class="option-row">
            <input type="checkbox" bind:checked={vertexColors} onchange={onVertexColorsChange} />
            Vertex Colors
          </label>
          <div class="option-row">
            <label for="bg-color">Background</label>
            <input id="bg-color" type="color" bind:value={bgColor} oninput={onBgColorChange} />
          </div>
          <label class="option-row">
            <input type="checkbox" bind:checked={autoRotate} />
            Auto-Rotate
          </label>
          <div class="slider-row" class:disabled={!autoRotate}>
            <span>Speed</span>
            <input type="range" min="0.1" max="5" step="0.1" bind:value={rotateSpeed} disabled={!autoRotate} />
            <span class="slider-val">{rotateSpeed.toFixed(1)}x</span>
          </div>
        </div>
      {:else}
        <div class="tab-content">
          {#if modelLoaded}
            <div class="stat-row"><span class="stat-label">Vertices</span><span class="stat-val">{stats.verts.toLocaleString()}</span></div>
            <div class="stat-row"><span class="stat-label">Faces</span><span class="stat-val">{stats.faces.toLocaleString()}</span></div>
            <div class="stat-row"><span class="stat-label">Textures</span><span class="stat-val">{stats.textures.length}</span></div>
          {:else}
            <p class="no-model">Load a model to see statistics.</p>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .side-panel {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    z-index: 5;
  }

  .panel-toggle {
    position: absolute;
    right: -22px;
    top: 50%;
    transform: translateY(-50%);
    width: 22px;
    height: 48px;
    border-left: none;
    cursor: pointer;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 6;
    padding: 0;
  }

  .panel-toggle:hover {
    color: var(--text-h);
    box-shadow: var(--shadow);
  }

  .panel-inner {
    width: 220px;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
  }

  .tabs button {
    flex: 1;
    padding: 0.5rem 0;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.85rem;
    transition: color 0.15s, background 0.15s;
  }

  .tabs button:hover {
    color: var(--text-h);
    background: var(--accent-bg);
  }

  .tabs button.active {
    color: var(--text-h);
    border-bottom: 2px solid currentcolor;
    margin-bottom: -1px;
  }

  .tab-content {
    padding: 1rem;
    font-size: 0.88rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .option-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
  }

  .option-row input[type='checkbox'] {
    /* sizing handled by global 1em rule */
  }

  .option-row input[type='color'] {
    width: 32px;
    height: 22px;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: none;
    cursor: pointer;
  }

  .option-row label[for='bg-color'] {
    flex: 1;
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.88rem;
  }

  .slider-row.disabled {
    opacity: 0.4;
  }

  .slider-row input[type='range'] {
    flex: 1;
    accent-color: currentcolor;
    min-width: 0;
  }

  .slider-val {
    width: 2.8rem;
    text-align: right;
    color: var(--text-h);
    font-size: 0.82rem;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    padding: 0.3rem 0;
    border-bottom: 1px solid var(--border);
  }

  .stat-val {
    color: var(--text-h);
    font-weight: 600;
  }

  .no-model {
    margin: 0;
    font-size: 0.82rem;
  }
</style>
