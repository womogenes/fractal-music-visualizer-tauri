<script lang="ts">
  import { onMount } from 'svelte';
  import fragShaderSource from './shader.frag?raw';

  import { getCurrentWindow } from '@tauri-apps/api/window';

  import GlslCanvas from 'glslCanvas';

  let canvasEl: any;

  onMount(() => {
    if (!canvasEl) console.log('oopsie');

    const sandbox = new GlslCanvas(canvasEl);
    sandbox.load(fragShaderSource);

    sandbox.setUniform('zoom', 5.0);
    const a = Math.PI * 0.74;
    sandbox.setUniform('c', 0.7885 * Math.cos(a), 0.7885 * Math.sin(a));

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;

      const width = window.innerWidth * dpr;
      const height = window.innerHeight * dpr;
      canvasEl.width = width;
      canvasEl.height = height;

      console.log(width, height);
    };

    window.onresize = handleResize;
    handleResize();

    (async () => {
      console.log(await getCurrentWindow().scaleFactor());
    })();

    const ctx = canvasEl.getContext('2d');
    if (ctx) ctx.imageSmoothingEnabled = false;
  });
</script>

<main class="flex h-full w-full">
  <canvas class="glslCanvas h-full w-full" bind:this={canvasEl}></canvas>
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
