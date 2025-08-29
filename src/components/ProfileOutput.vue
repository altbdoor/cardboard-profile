<script setup lang="ts">
import { watchTriggerable } from "@vueuse/core";
import { toCanvas, toString } from "qrcode";
import { computed, onMounted, ref } from "vue";

const props = defineProps<{ config: string }>();
const canvasRef = ref<HTMLCanvasElement | null>(null);

const googleCardboardUrl = "http://google.com/cardboard/cfg?p=";
const computedUrl = computed(() => googleCardboardUrl + props.config);

const { trigger: triggerCheckConfig } = watchTriggerable(
  computedUrl,
  async (configUrl) => {
    if (!canvasRef.value) {
      return;
    }

    toCanvas(canvasRef.value, configUrl);
  },
);

onMounted(() => {
  triggerCheckConfig();
});

const saveImageAs = async (mode: "png" | "svg") => {
  if (!canvasRef.value) {
    return;
  }

  const blob = await new Promise<Blob | null>(async (resolve) => {
    if (mode === "svg") {
      const svgStr = await toString(computedUrl.value, { type: "svg" });
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
      <div class="alert alert-info text-center">
        Adjust the parameters, and wait for the QR to change!
      </div>

      <div class="d-flex flex-column gap-3">
        <div class="text-center">
          <canvas
            ref="canvasRef"
            class="border border-secondary-subtle"
          ></canvas>
        </div>

        <div class="d-flex gap-3 justify-content-center">
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

        <textarea
          class="form-control"
          rows="3"
          readonly
          :value="computedUrl"
        ></textarea>
        <div class="text-center">
          <a :href="computedUrl" target="_blank"> Cardboard profile URL </a>
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
