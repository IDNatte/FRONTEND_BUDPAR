<script>
  import { querystring, link, location } from "svelte-spa-router";
  import { fade, fly } from "svelte/transition";

  import { API, ASSETS, BASEURI } from "../../lib/config";

  import LoadingCircleAnimationComponent from "../../components/animation/LoadingCircleAnimationComponent.svelte";
  import FooterComponent from "../../components/footer/FooterComponent.svelte";
  import TourContentCard from "../../components/card/TourContentCard.svelte";

  $: title = new URLSearchParams($querystring).get("title");
  let queryparams = new URLSearchParams($querystring);
  let displayImage;

  async function getDetail() {
    let detail = await fetch(`${API}/article/${queryparams.get("q")}/show`);

    if (detail.status === 200) {
      let detailData = await detail.json();
      displayImage = `${ASSETS}/${detailData.data.article_detail.thumb}`;
      return detailData.data;
    } else {
      throw new Error("Could not fetchin data !");
    }
  }

  let detailData = getDetail();

  function showMainImage(imageUrl) {
    displayImage = `${imageUrl}`;
  }
</script>

<svelte:head>
  <!-- svelte-ignore component-name-lowercase -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
  />

  <meta
    name="description"
    content="{title} di kabupaten tapin dari Dinas Kebudayaan dan Pariwisata Kabupaten Tapin"
  />

  <!-- svelte-ignore component-name-lowercase -->
  <link rel="canonical" href={`${BASEURI}#${$location}?${$querystring}`} />

  <title>
    {title} | Dinas Kebudayaan dan Pariwisata Kabupaten Tapin
  </title>
</svelte:head>

{#await detailData}
  <div class="w-full h-screen pb-24">
    <div
      class="h-screen flex items-center justify-center py-32"
      in:fade={{ duration: 200 }}
    >
      <LoadingCircleAnimationComponent size={{ w: "w-12", h: "h-12" }} />
    </div>
  </div>
{:then data}
  <div class="__content-page-news" in:fade={{ duration: 200 }}>
    <div class="pt-36 relative">
      <img
        src={displayImage}
        alt={title}
        class="w-full h-[512px] object-cover"
        in:fly={{ y: -20 }}
      />
      <div
        class="__content-title __shadow absolute w-full bottom-0 px-7 md:px-14 lg:px-32"
      >
        <div class="py-5">
          <div class="__content-subtitle">
            <h1 class="text-white font-bold text-xl md:text-3xl uppercase">
              {data.article_detail.title}
            </h1>
          </div>

          <div class="flex pb-3">
            {#each data.article_detail.tags as { tag }}
              <h3
                class="text-white uppercase font-bold text-md md:text-xl decoration-[#00d6a1] decoration-2 underline underline-offset-4 pr-2 pt-3"
              >
                <span>#{tag}</span>
              </h3>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <div
      class="__content-main grid grid-cols-12 px-7 gap-y-8 lg:gap-y-16 md:px-7 lg:px-32 py-7 lg:py-24"
    >
      <div class="col-span-full lg:col-span-full">
        <h2 class="font-bold text-2xl uppercase">
          {data.article_detail.title}
        </h2>
        <p class="py-5 lg:py-24">
          {@html data.article_detail.body}
        </p>
      </div>
    </div>

    <FooterComponent />
  </div>
{/await}

<style>
  .__shadow {
    background: rgb(255, 255, 255);
    background: linear-gradient(
      0deg,
      rgb(0, 0, 0) 0%,
      rgba(255, 255, 255, 0) 100%
    );
  }
</style>
