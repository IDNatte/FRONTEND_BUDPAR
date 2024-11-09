<script>
  // import { Tabs, Tab, TabList, TabPanel } from "svelte-tabs";
  import { querystring, link, location } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import Lazy from "svelte-lazy";

  import { API, ASSETS, BASEURI } from "../../lib/config";
  // import { openModal } from "../../lib/module/modal";
  import { openViewer } from "../../lib/module/imageViewer";

  import LoadingCircleAnimationComponent from "../../components/animation/LoadingCircleAnimationComponent.svelte";
  import MapCardComponent from "../../components/card/MapCardComponent.svelte";
  import FooterComponent from "../../components/footer/FooterComponent.svelte";
  import ImageViewerComponent from "../../components/modal/ImageViewerComponent.svelte";

  import PhoneCircleGreenIcon from "../../assets/svg/PhoneCircleGreenIcon.svelte";
  import WorldCircleGreenIcon from "../../assets/svg/WorldCircleGreenIcon.svelte";
  import ClockCircleGreenIcon from "../../assets/svg/ClockCircleGreenIcon.svelte";
  import PinCircleGreenIcon from "../../assets/svg/PinCircleGreenIcon.svelte";
  import MapFoldIcon from "../../assets/svg/MapFoldIcon.svelte";
  import FlyIcon from "../../assets/svg/FlyIcon.svelte";

  $: title = new URLSearchParams($querystring).get("title");
  let queryparams = new URLSearchParams($querystring);
  let displayImage;

  async function getDetail() {
    let detail = await fetch(`${API}/food/${queryparams.get("q")}/show`);

    if (detail.status === 200) {
      let detailData = await detail.json();
      displayImage = `${ASSETS}/${detailData.data.food_detail.thumb}`;
      console.log(detailData.data);
      return detailData.data;
    } else {
      throw new Error("Could not fetchin data !");
    }
  }

  let detailData = getDetail();
  let ModalImage = "";
  let modalAlt = "";

  function openModalImage(link, alt) {
    ModalImage = link;
    modalAlt = alt;
    openViewer("__photoModalResto");
  }

  // function showMainImage(imageUrl) {
  //   displayImage = `${imageUrl}`;
  // }
</script>

<svelte:head>
  <!-- svelte-ignore component-name-lowercase -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
  />

  <meta
    name="description"
    content="Rumah Makan {title} di kabupaten tapin dari Dinas Kebudayaan dan Pariwisata Kabupaten Tapin"
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
  <div class="__content-page-resto" in:fade={{ duration: 200 }}>
    <div class="pt-36 relative">
      <img
        src={displayImage}
        alt={title}
        class="w-full h-[512px] object-cover"
      />
      <div
        class="__content-title __shadow absolute bottom-0 w-full px-7 md:px-14 lg:px-32"
      >
        <div class="py-5">
          {#if data.food_detail.distriction.name}
            <div class="flex pb-3">
              <h3
                class="text-white uppercase font-bold text-md md:text-xl decoration-[#00d6a1] decoration-2 underline underline-offset-4"
              >
                {data.food_detail.distriction.name}
              </h3>
            </div>
          {/if}
          <div class="__content-subtitle">
            <h1 class="text-white font-bold text-xl md:text-3xl uppercase">
              {data.food_detail.name}
            </h1>
          </div>
        </div>
      </div>
    </div>

    <div
      class="__content-main grid grid-cols-12 px-7 gap-y-8 lg:gap-y-16 md:px-7 lg:px-32 py-7 lg:py-24"
    >
      <div class="col-span-full">
        <div class="flex">
          {#if data.food_detail.food_sliders.length > 0}
            {#each data.food_detail.food_sliders as { image }}
              <a
                class="px-3 duration-300 hover:drop-shadow-lg"
                href="#!"
                on:click|preventDefault={() =>
                  openModalImage(`${ASSETS}/${image}`, title)}
              >
                <Lazy height={96} fadeOption={{ delay: 500, duration: 1000 }}>
                  <img
                    src={`${ASSETS}/${image}`}
                    class="drop-shadow-md w-[120px] h-[96px] rounded"
                    alt={title}
                  />
                </Lazy>
              </a>
            {/each}
          {:else}
            <a
              class="px-3 duration-300 hover:drop-shadow-lg"
              href="#!"
              on:click|preventDefault={() =>
                openModalImage(`${ASSETS}/${data.food_detail.thumb}`, title)}
            >
              <Lazy height={96} fadeOption={{ delay: 500, duration: 1000 }}>
                <img
                  src={`${ASSETS}/${data.food_detail.thumb}`}
                  class="drop-shadow-md w-[120px] h-[96px] rounded"
                  alt={title}
                />
              </Lazy>
            </a>
          {/if}
        </div>
      </div>
      <div class="col-span-full lg:col-span-8">
        <h2 class="font-bold text-2xl uppercase">
          {data.food_detail.name}
        </h2>
        <p class="py-5">
          {@html data.food_detail.description}
        </p>
      </div>
      <div class="col-span-full lg:col-span-4 lg:px-7">
        <div class="w-full flex items-center py-5">
          <MapFoldIcon />
          <h3 class="font-bold text-2xl pl-4">Maps</h3>
        </div>
        <div class="__minimap-wrapper pb-7">
          <MapCardComponent
            objectType="resto"
            latlng={[
              `${data.food_detail.latitude}`,
              `${data.food_detail.longitude}`,
            ]}
          />
        </div>
        <a
          href="/direction?{new URLSearchParams({
            type: 'resto',
            title: `${data.food_detail.name}`,
            lat: `${data.food_detail.latitude}`,
            lng: `${data.food_detail.longitude}`,
          }).toString()}"
          class="rounded-lg bg-[#00d6a1] flex w-full items-center justify-center py-3"
          use:link
        >
          <FlyIcon />
          <span class="text-white pl-5">Open Map</span>
        </a>

        <div class="__content-info mt-6 pt-5 border-t">
          {#if data.food_detail.address}
            <div class="__address flex items-center">
              <PinCircleGreenIcon />
              <div class="__address-text pl-3">
                <h3 class="font-bold">Alamat</h3>
                <span>{data.food_detail.address}</span>
              </div>
            </div>
          {/if}

          {#if data.food_detail.office_hours}
            <div class="__open-hours flex items-center pt-5">
              <ClockCircleGreenIcon />
              <div class="__open-hours-text pl-3">
                <h3 class="font-bold">Waktu buka</h3>
                <span>{data.food_detail.office_hours}</span>
              </div>
            </div>
          {/if}

          {#if data.food_detail.phone}
            <div class="__contact-person flex items-center pt-5">
              <PhoneCircleGreenIcon />
              <div class="__contact-person-text pl-3">
                <h3 class="font-bold">Telepon</h3>
                <span>{data.food_detail.phone}</span>
              </div>
            </div>
          {/if}

          {#if data.food_detail.website}
            <div class="__affiliated-web flex items-center pt-5">
              <WorldCircleGreenIcon />
              <div class="__affiliated-web-text pl-3">
                <h3 class="font-bold">Website</h3>
                <a
                  class="underline"
                  href={data.food_detail.website}
                  target="_blank">{data.food_detail.website}</a
                >
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <FooterComponent />
  </div>

  <ImageViewerComponent className="__photoModalResto">
    <div slot="__viewer-content" class="__slot-wrapper">
      <img class="w-[60%] m-auto rounded" src={ModalImage} alt={modalAlt} />
    </div>
  </ImageViewerComponent>

  <!-- <ModalComponent className="__photoModal">
    <div slot="__modal-content" class="__slot-wrapper py[4rem]">
      <img
        class="object-fit h-screen w-full py-[4rem]"
        src={ModalImage}
        alt={modalAlt}
      />
    </div>
  </ModalComponent> -->
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
