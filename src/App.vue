<script setup lang="ts">
import { useUrlSearchParams } from "@vueuse/core";
import { computed, ref } from "vue";
import CardboardForm from "./components/CardboardForm.vue";
import ProfileOutput from "./components/ProfileOutput.vue";

const router = useUrlSearchParams();
const initialConfig = ref(String(router.p ?? ""));
const reactiveConfig = computed(() => String(router.p ?? ""));

const handleSubmit = (config: string) => {
  router.p = config;
};

const changeInitialConfig = () => {
  const existingUrl = prompt("Please paste in the cardboard profile URL.");
  if (!existingUrl) {
    return;
  }

  try {
    const existingUrlObj = new URL(existingUrl);
    const configP = existingUrlObj.searchParams.get("p") ?? "";
    if (configP === "") {
      throw Error("Unable to find profile parameter");
    }

    initialConfig.value = configP;
  } catch (err) {
    console.error(err);
    alert("Invalid cardboard profile URL.");
  }
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
    the <a href="https://wwgc.firebaseapp.com/">original site</a> is buggy.
    Please check the
    <a
      href="https://support.google.com/cardboard/manufacturers/checklist/6322188"
      >guide</a
    >
    on how to fill the fields.
  </p>
  <p>
    Alternatively,
    <a href="#" @click.prevent="changeInitialConfig">click here</a> to reuse an
    existing cardboard profile URL.
  </p>

  <div class="row">
    <div class="col-md-8">
      <CardboardForm
        :initial-config="initialConfig"
        @update:config="handleSubmit"
      />
    </div>
    <div class="col-md-4 position-relative">
      <div class="sticky-md-top pt-3">
        <ProfileOutput :config="reactiveConfig" />
      </div>
    </div>
  </div>

  <hr />

  <a href="https://github.com/altbdoor/cardboard-profile">GitHub</a>
</template>
