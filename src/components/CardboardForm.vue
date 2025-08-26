<script setup lang="ts">
import {
  getDefaultParams,
  PrimaryButton,
  VerticalAlignment,
  type CardboardParams,
} from "./cardboard-param";

const params = defineModel<CardboardParams>({
  default: getDefaultParams,
});

const fovAngles = ["Outer", "Inner", "Top", "Bottom"] as const;
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
  </div>
</template>
