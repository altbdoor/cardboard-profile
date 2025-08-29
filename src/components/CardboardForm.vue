<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { reactive, watch } from "vue";
import {
  getDefaultParams,
  PrimaryButton,
  VerticalAlignment,
  type CardboardParams,
} from "./cardboard-param";

const props = defineProps<{ initialConfig: string }>();
const emit = defineEmits<{ (e: "update:config", value: string): void }>();

const getCardboard = (config: string) => {
  const googleCardboardUrl = "http://google.com/cardboard/cfg?p=";

  try {
    const cardboardObj = (window as any).CARDBOARD.uriToParamsProto(
      googleCardboardUrl + config,
    );
    return cardboardObj;
  } catch (err) {
    alert("Invalid config hash");
    console.error(err);
  }

  return {};
};

const params = reactive<CardboardParams>(getDefaultParams());

watch(
  () => props.initialConfig,
  (initialConfig) => {
    if (initialConfig === "") {
      return;
    }

    let cardboardObj = getCardboard(initialConfig);
    Object.entries(cardboardObj).forEach(([key, val]) => {
      // converts m values to mm
      if (key.includes("_distance") && typeof val === "number") {
        cardboardObj[key] = Math.round(val * 1000);
      }
    });

    Object.assign(params, cardboardObj);
  },
  { immediate: true },
);

watchDebounced(
  params,
  (newVal) => {
    let cardboardObj = getCardboard("");

    Object.assign(cardboardObj, newVal);
    Object.entries(cardboardObj).forEach(([key, val]) => {
      // converts mm values to m
      if (key.includes("_distance") && typeof val === "number") {
        cardboardObj[key] = val / 1000;
      }
    });

    const cleanedB64 = (cardboardObj.toBase64() as string)
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replace(/\=+$/, "");

    emit("update:config", cleanedB64);
  },
  { deep: true, debounce: 200 },
);

const fovAngles = ["Outer", "Inner", "Top", "Bottom"] as const;

const handleReset = () => {
  Object.assign(params, getDefaultParams());
};
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <div>
      <label class="form-label">Vendor</label>
      <input type="text" v-model="params.vendor" class="form-control" />
    </div>
    <div>
      <label class="form-label">Model name</label>
      <input type="text" v-model="params.model" class="form-control" />
    </div>
    <div>
      <label class="form-label">Primary button</label>
      <div>
        <div
          v-for="(value, key) in PrimaryButton"
          :key="value"
          class="form-check form-check-inline"
        >
          <input
            class="form-check-input"
            type="radio"
            :id="'primarybtn' + value"
            :value="value"
            name="primarybtn"
            v-model.number="params.primary_button"
          />
          <label class="form-check-label" :for="'primarybtn' + value">
            {{ key }}
          </label>
        </div>
      </div>
    </div>

    <div>
      <label class="form-label">Screen to lens distance (mm)</label>
      <input
        type="number"
        v-model.number="params.screen_to_lens_distance"
        class="form-control"
        min="0"
        step="1"
      />
    </div>
    <div>
      <label class="form-label">Inter-lens distance (mm)</label>
      <input
        type="number"
        v-model.number="params.inter_lens_distance"
        class="form-control"
        min="0"
        step="1"
      />
    </div>

    <div>
      <label class="form-label">Screen vertical alignment</label>
      <div>
        <div
          v-for="(value, key) in VerticalAlignment"
          :key="value"
          class="form-check form-check-inline"
        >
          <input
            class="form-check-input"
            type="radio"
            :id="'valign' + value"
            :value="value"
            name="valign"
            v-model.number="params.vertical_alignment"
          />
          <label class="form-check-label" :for="'valign' + value">
            {{ key }}
          </label>
        </div>
      </div>
    </div>

    <div>
      <label class="form-label">Tray to lens-center distance (mm)</label>
      <input
        type="number"
        v-model.number="params.tray_to_lens_distance"
        class="form-control"
        min="0"
        step="1"
      />
    </div>

    <div>
      <label class="form-label">Distortion coefficients</label>

      <div class="row">
        <div
          v-for="(_coeff, idx) in params.distortion_coefficients"
          class="col"
        >
          <div class="input-group">
            <span class="input-group-text"
              >k <sub>{{ idx + 1 }}</sub></span
            >
            <input
              type="number"
              class="form-control"
              step="0.01"
              min="0"
              v-model.number="params.distortion_coefficients[idx]"
            />
          </div>
        </div>
      </div>
    </div>

    <div>
      <label class="form-label">Field-of-view angles (deg)</label>

      <div class="d-flex flex-column gap-2">
        <div v-for="(label, idx) in fovAngles" class="input-group">
          <span class="input-group-text">{{ label }}</span>
          <input
            type="number"
            v-model.number="params.left_eye_field_of_view_angles[idx]"
            class="form-control"
            min="0"
            step="1"
          />
        </div>
      </div>
    </div>

    <div>
      <button
        type="button"
        class="btn btn-outline-secondary"
        @click="handleReset"
      >
        Reset values
      </button>
    </div>
  </div>
</template>
