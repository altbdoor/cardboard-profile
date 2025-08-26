<script setup lang="ts">
import { toCanvas, toString } from "qrcode";
import { nextTick, ref, watch } from "vue";

const props = defineProps<{ url: string }>();
const canvasRef = ref<HTMLCanvasElement | null>(null);

watch(
  () => props.url,
  async (url) => {
    await nextTick();

    if (!url || !canvasRef.value) {
      return;
    }

    toCanvas(canvasRef.value, url);
  },
  { immediate: true },
);

const saveImageAs = async (mode: "png" | "svg") => {
  if (!canvasRef.value) {
    return;
  }

  const blob = await new Promise<Blob | null>(async (resolve) => {
    if (mode === "svg") {
      const svgStr = await toString(props.url, { type: "svg" });
      const svgBlob = new Blob([svgStr], { type: "image/svg+xml" });
      resolve(svgBlob);
    } else {
      canvasRef.value!.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    }
  });

  if (!blob) {
    alert("Unable to generate QR code image to save");
    return;
  }

  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank");
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="alert alert-info" v-if="!props.url">
        Adjust the parameters, and click on Generate profile!
      </div>

      <div v-show="!!props.url">
        <div class="text-center">
          <canvas ref="canvasRef"></canvas>
        </div>

        <div class="pt-3 d-flex gap-3 justify-content-center">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="saveImageAs('png')"
          >
            Save as PNG
          </button>
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="saveImageAs('svg')"
          >
            Save as SVG
          </button>
        </div>

        <div class="pt-3 text-center">
          <a :href="props.url" target="_blank"> Cardboard profile URL </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
canvas {
  max-width: 100%;
  max-height: 100%;
  width: auto !important;
  height: auto !important;
}
</style>
