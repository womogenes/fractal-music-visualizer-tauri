<script lang="ts">
  import { onMount } from 'svelte';
  import fragShaderSource from './shader.frag?raw';

  import GlslCanvas from 'glslCanvas';

  let canvasEl: any;
  let angle = Math.PI * 0.25;
  let resolution = '2048x1024';

  let gamma = 0.9;
  let returnValue = 0.2;
  let scaleValue = 0.1;
  let offsetValue = 0.0;

  let r = 1.0;
  let g = 0.3;
  let b = 0.3;
  let zoom = 4.0;

  let sandbox: any;

  function handleResize() {
    if (!canvasEl) return;
    const [width, height] = resolution.split('x').map(Number);
    canvasEl.width = width;
    canvasEl.height = height;
  }

  onMount(() => {
    if (!canvasEl) console.log('oopsie');

    handleResize();

    sandbox = new GlslCanvas(canvasEl, { preserveDrawingBuffer: true });
    sandbox.load(fragShaderSource);

    sandbox.setUniform('zoom', 4.0);

    let mouseX = 0;
    let mouseY = 0;
    window.onmousemove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const render = () => {
      const c = [0.7885 * Math.cos(angle), 0.7885 * Math.sin(angle)];

      sandbox.setUniform('c', c[0], c[1]);
      sandbox.setUniform('r', r);
      sandbox.setUniform('g', g);
      sandbox.setUniform('b', b);
      sandbox.setUniform('zoom', zoom);
      sandbox.setUniform('gamma', gamma);
      sandbox.setUniform('returnValue', returnValue);
      sandbox.setUniform('scaleValue', scaleValue);
      sandbox.setUniform('offsetValue', offsetValue);
      requestAnimationFrame(render);
    };
    render();
  });
</script>

<main class="flex gap-6 p-6">
  <canvas class="glslCanvas w-full max-w-xl" bind:this={canvasEl}></canvas>
  <div class="flex flex-col">
    <label>
      Resolution:
      <select bind:value={resolution} on:change={handleResize}>
        <option value="1024x1024">1024x1024</option>
        <option value="2048x1024">2048x1024</option>
      </select>
    </label>
    <label>
      Angle: {angle.toFixed(2)}
      <input
        type="range"
        bind:value={angle}
        min="0"
        max={Math.PI * 2}
        step="0.01"
      />
    </label>
    <label>
      R: {r.toFixed(2)}
      <input type="range" bind:value={r} min="0" max="1" step="0.01" />
    </label>
    <label>
      G: {g.toFixed(2)}
      <input type="range" bind:value={g} min="0" max="1" step="0.01" />
    </label>
    <label>
      B: {b.toFixed(2)}
      <input type="range" bind:value={b} min="0" max="1" step="0.01" />
    </label>
    <label>
      Zoom: {zoom.toFixed(2)}
      <input type="range" bind:value={zoom} min="0" max="20" step="0.1" />
    </label>
    <label>
      Gamma: {gamma.toFixed(2)}
      <input type="range" bind:value={gamma} min="0" max="2" step="0.01" />
    </label>
    <label>
      Zero Value: {returnValue.toFixed(2)}
      <input
        type="range"
        bind:value={returnValue}
        min="0"
        max="1"
        step="0.01"
      />
    </label>
    <label>
      Scale Value: {scaleValue.toFixed(2)}
      <input type="range" bind:value={scaleValue} min="0" max="1" step="0.01" />
    </label>
    <label>
      Offset Value: {offsetValue.toFixed(2)}
      <input
        type="range"
        bind:value={offsetValue}
        min="-5"
        max="5"
        step="0.1"
      />
    </label>
  </div>
</main>

<style>
  canvas {
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    image-rendering: -webkit-optimize-contrast; /* Sometimes recognized by WebKit */
    image-rendering: -webkit-crisp-edges; /* WebKit-prefixed for Safari/WebKitGTK */
    image-rendering: -moz-crisp-edges; /* Firefox/Gecko (optional) */
  }
</style>
