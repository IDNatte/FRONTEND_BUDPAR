<script>
  import { link } from "svelte-spa-router";
  import Lazy from "svelte-lazy";

  import MapPinFillIcon from "../../assets/svg/MapPinFillIcon.svelte";
  import { truncate } from "../../lib/module/truncate";

  export let imageUrl;
  export let tourTitle;
  export let tourAddress;
  export let tourDetail;
</script>

<div class="__tour-content-card">
  <div class="__tour-object-card-wrapper relative">
    <a
      class="flex justify-center items-center"
      href="/tour-detail?{`${new URLSearchParams({
        title: tourTitle,
        q: tourDetail,
      }).toString()}`}"
      use:link
    >
      <Lazy height={350} fadeOption={{ delay: 500, duration: 1000 }}>
        <img
          src={imageUrl}
          alt={tourTitle}
          class="h-[350px] w-[291px] md:w-auto rounded-[20px] object-cover drop-shadow-md"
        />
      </Lazy>

      <div
        class="__card-content rounded-b-[20px] w-[291px] md:w-full mx-2 px-6 absolute bottom-0 py-5 text-white"
      >
        <h3 class="text-xl font-bold capitalize pb-2 __text-shadow">
          {tourTitle}
        </h3>
        <div class="flex items-center">
          <MapPinFillIcon />
          <span class="pl-3 uppercase">{truncate(tourAddress, 20)}</span>
        </div>
      </div>
    </a>
  </div>
</div>

<style>
  .__text-shadow {
    text-shadow: 0px 2px 3px #314c49;
  }

  .__card-content {
    background: rgb(2, 0, 36);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 0%,
      rgb(0, 0, 0) 100%
    );
  }
</style>
