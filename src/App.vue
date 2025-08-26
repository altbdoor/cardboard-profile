<script setup lang="ts">
import { ref } from "vue";
import {
  getDefaultParams,
  type CardboardParams,
} from "./components/cardboard-param";
import CardboardForm from "./components/CardboardForm.vue";
import ProfileOutput from "./components/ProfileOutput.vue";

const params = ref<CardboardParams>(getDefaultParams());
const googleCardboardUrl = "http://google.com/cardboard/cfg?p=";

const generatedUrl = ref("");

const handleSubmit = () => {
  const cardboardObj = (window as any).CARDBOARD.uriToParamsProto(
    googleCardboardUrl,
  );

  Object.entries(params.value).forEach(([key, val]) => {
    // converts mm values to m
    if (key.includes("_distance") && typeof val === "number") {
      cardboardObj[key] = val / 1000;
    } else {
      cardboardObj[key] = val;
    }
  });

  const cleanedB64 = (cardboardObj.toBase64() as string)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/\=+$/, "");

  /** @todo: save url state into query params */
  generatedUrl.value = googleCardboardUrl + cleanedB64;
};
</script>

<template>
  <h1>
    <img src="/icon.png" width="32" height="32" alt="cardboard icon" />
    cardboard profile generator
  </h1>
  <hr />
  <p>
    Generating Google Cardboard profile based on
    <a href="https://stackoverflow.com/a/77317690">StackOverflow</a>, because
    the <a href="https://wwgc.firebaseapp.com/">original site</a> is dead.
    Please check the
    <a
      href="https://support.google.com/cardboard/manufacturers/checklist/6322188"
      >guide</a
    >
    on how to fill the fields.
  </p>

  <div class="row">
    <div class="col-md-8">
      <form @submit.prevent="handleSubmit">
        <CardboardForm v-model="params" />
        <div class="pt-3">
          <button type="submit" class="btn btn-lg btn-primary w-100">
            Generate profile QR
          </button>
        </div>
      </form>
    </div>
    <div class="col-md-4 position-relative">
      <div class="sticky-md-top pt-3">
        <ProfileOutput :url="generatedUrl" />
      </div>
    </div>
  </div>
</template>
