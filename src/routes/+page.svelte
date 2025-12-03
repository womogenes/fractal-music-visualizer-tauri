<script lang="ts">
  import { onMount } from 'svelte';
  import fragShaderSource from './shader.frag?raw';

  import GlslCanvas from 'glslCanvas';

  let canvasEl: any;

  onMount(() => {
    if (!canvasEl) console.log('oopsie');

    const handleResize = () => {
      // const dpr = window.devicePixelRatio || 1;
      const dpr = 2.0;

      // const width = window.innerWidth * dpr;
      // const height = window.innerHeight * dpr;

      const width = 2048;
      const height = 1024;
      canvasEl.width = width;
      canvasEl.height = height;

      console.log(width, height);

      console.log(width, height);
    };

    window.onresize = handleResize;
    handleResize();

    const sandbox = new GlslCanvas(canvasEl, { preserveDrawingBuffer: true });
    sandbox.load(fragShaderSource);

    sandbox.setUniform('zoom', 4.0);

    let mouseX = 0;
    let mouseY = 0;
    window.onmousemove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const render = () => {
      // const a = performance.now() * 0.001 + Math.PI * 0.75;
      // const a = (mouseX / window.innerWidth) * Math.PI * 2;

      // const a = Math.PI * 1.0 + Math.sin(performance.now() * 0.0005) * 1.0;

      const a = Math.PI * 0.25;
      const zoom = 1;

      const c = [0.7885 * Math.cos(a), 0.7885 * Math.sin(a)];

      // let c = [-0.835, -0.2321];
      // c[0] += Math.cos(a) * 0.1;
      // c[1] += Math.sin(a) * 0.1;

      sandbox.setUniform('c', c[0], c[1]);
      const rgb = [1.0, 0.3, 0.3];
      const s = 1;

      sandbox.setUniform('r', rgb[0] * s);
      sandbox.setUniform('g', rgb[1] * s);
      sandbox.setUniform('b', rgb[2] * s);
      sandbox.setUniform('zoom', 10.0);
      requestAnimationFrame(render);
    };
    render();
  });
</script>

<main class="flex">
  <canvas class="glslCanvas" bind:this={canvasEl}></canvas>
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
