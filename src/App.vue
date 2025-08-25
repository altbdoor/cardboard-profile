<script setup lang="ts">
// import { reactive, definemodel } from "vue";
import { ref } from "vue";
import {
  getDefaultParams,
  type CardboardParams,
} from "./components/cardboard-param";
import CardboardForm from "./components/CardboardForm.vue";

const params = ref<CardboardParams>(getDefaultParams());
const googleCardboardUrl = "http://google.com/cardboard/cfg?p=";

const handleSubmit = () => {
  const cardboardObj = (window as any).CARDBOARD.uriToParamsProto(
    googleCardboardUrl,
  );

  Object.entries(params.value).forEach(([key, val]) => {
    cardboardObj[key] = val;
  });

  const cleanedB64 = (cardboardObj.toBase64() as string)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/\=+$/, "");
  console.log(googleCardboardUrl + cleanedB64);
};
</script>

<template>
  <h1>cardboard profile generator</h1>
  <hr />
  <p>
    Generating profile for Google Cardboard based on
    <a href="https://stackoverflow.com/a/77317690"
      >https://stackoverflow.com/a/77317690</a
    >.
  </p>

  <form @submit.prevent="handleSubmit">
    <pre><code>{{ params }}</code></pre>
    <CardboardForm v-model="params" />
    <div class="mt-3">
      <button type="submit" class="btn btn-primary">Generate profile</button>
    </div>
  </form>
</template>
