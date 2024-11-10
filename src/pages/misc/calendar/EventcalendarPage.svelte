<script>
  import { onDestroy, onMount } from "svelte";

  import { fade } from "svelte/transition";
  import { get } from "svelte/store";

  import sanitizeHtml from "sanitize-html";

  import { eventCalendarStore } from "../../../lib/store/eventCalendar/eventCalendare.store";
  import { APIV2, BASEURI } from "../../../lib/config";

  import LoadingCircleAnimationComponent from "../../../components/animation/LoadingCircleAnimationComponent.svelte";
  import ContentLoadAnimationComponent from "../../../components/animation/ContentLoadAnimationComponent.svelte";
  import EventCalendarCardComponent from "../../../components/card/EventCalendarCardComponent.svelte";
  import FooterComponent from "../../../components/footer/FooterComponent.svelte";

  const months = [
    "Januari",
    "Febuari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const maxItem = 3;
  let currentPage = 1;
  let maxPage = undefined;

  let selectedMonth = undefined;
  let selectedCategory = undefined;
  let contentLoad = undefined;
  let observerAnchor;

  const observer = new IntersectionObserver(
    async (event) => {
      const [entries] = event;
      if (entries.isIntersecting) {
        console.log(maxPage);
        if (currentPage < maxPage) {
          currentPage += 1;
          contentLoad = true;

          await getNextPageEvent(selectedMonth, selectedCategory, currentPage);
        }
      }
    },
    {
      root: observerAnchor,
      rootMargin: "0px",
      threshold: 0.5,
    },
  );

  async function getEvent(month = undefined, category = undefined) {
    // loading = true;
    let event = await fetch(
      `${APIV2}/event?paginate=${maxItem}&page=${currentPage}&kategori=${category ? category : ""}&bulan=${month ? month : ""}`,
    );

    if (event.status === 200) {
      let eventData = await event.json();
      eventCalendarStore.set({ data: eventData.data });
      maxPage = eventData.last_page;
      currentPage = 1;
      return eventData.data;
    } else {
      throw new Error("Could not fetch data !");
    }
  }

  async function getNextPageEvent(
    month = undefined,
    category = undefined,
    page = undefined,
  ) {
    let event = await fetch(
      `${APIV2}/event?paginate=${maxItem}&page=${page}&kategori=${category ? category : ""}&bulan=${month ? month : ""}`,
    );

    if (event.status === 200) {
      let eventData = await event.json();
      let previewData = get(eventCalendarStore).data;
      eventCalendarStore.set({
        data: [...previewData, ...eventData.data],
      });

      contentLoad = false;
      return eventData.data;
    } else {
      contentLoad = false;
      throw new Error("Could not fetch data !");
    }
  }

  async function getCategory() {
    let category = await fetch(`${APIV2}/kategori-event`);

    if (category.status === 200) {
      let categoryData = await category.json();
      return categoryData.data;
    } else {
      throw new Error("Could not fetch data !");
    }
  }

  onMount(() => {
    observer.observe(document.querySelector(".__footer"));
  });

  onDestroy(() => {
    observer.unobserve(document.querySelector(".__footer"));
  });
</script>

<!-- meta tag for SEO -->
<svelte:head>
  <title>Kalender Event | Dinas Kebudayaan dan Pariwisata Kabupaten Tapin</title
  >
  <meta
    name="description"
    content="Kalender Event oleh Dinas Kebudayaan dan Pariwisata Kabupaten Tapin"
  />
  <meta
    name="keywords"
    content="Kalender Event oleh disbudpar kab tapin, berita disbudpar tapin"
  />
  <meta
    name="author"
    content="Dinas Kebudayaan dan Pariwisata Kabupaten Tapin"
  />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={`${BASEURI}#/event-calendar`} />
</svelte:head>
<!-- meta tag for SEO -->

<div class="__content-page-event-calendar" bind:this={observerAnchor}>
  <div class="pt-36 relative">
    <img
      src="/assets/images/placeholder/i-love-tapin.jpg"
      alt="placeholder"
      class="w-full h-[512px] object-cover"
    />
    <div class="__content-title absolute bottom-5 px-7 md:px-14 lg:px-32">
      <div class="flex pb-3">
        <h3
          class="text-white uppercase font-bold text-md md:text-xl decoration-[#00d6a1] decoration-2 underline underline-offset-4"
        >
          disbudpar
        </h3>
        <h3
          class="text-white uppercase font-bold text-md md:text-xl decoration-[#00d6a1] decoration-2 underline underline-offset-4 pl-3"
        >
          tapin
        </h3>
      </div>
      <div class="__content-subtitle">
        <h1 class="text-white font-bold text-xl md:text-3xl uppercase">
          Kalender Event
        </h1>
      </div>
    </div>
  </div>

  <div class="pt-20 relative">
    {#await getCategory()}
      <div
        class="col-span-full flex items-center justify-center"
        in:fade={{ duration: 200 }}
      >
        <LoadingCircleAnimationComponent size={{ w: "w-12", h: "h-12" }} />
      </div>
    {:then data}
      <!-- promise was fulfilled -->
      <div class="w-full md:px-10 lg:px-32 flex justify-end flex-row">
        <!-- bulan -->
        <div class="py-2 md:py-0 md:px-2">
          <!-- {selectedMonth} -->
          <select
            class="md:w-[11em] px-1 py-2 rounded"
            id="months"
            name="months"
            bind:value={selectedMonth}
          >
            <option value={undefined}>Bulan</option>
            {#each months as month, index}
              <!-- content here -->
              <option value={index + 1}>{month}</option>
            {/each}
          </select>
        </div>

        <!-- kategori -->
        <div class="py-2 px-5 md:py-0 md:px-2">
          <select
            class="md:w-[11em] px-1 py-2 rounded"
            id="categories"
            name="categories"
            bind:value={selectedCategory}
          >
            <option value={undefined}>Kategori</option>
            {#each data as { uuid, name }}
              <option value={uuid}>{name}</option>
            {/each}
          </select>
        </div>
      </div>
    {/await}
    <div
      class="__content-event-calendar py-32 md:px-10 lg:px-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-7 gap-y-11 md:gap-y-14 pb-24"
    >
      <!-- {#await getEvent(selectedMonth, selectedCategory)}
        <div
          class="col-span-full flex items-center justify-center"
          in:fade={{ duration: 200 }}
        >
          <LoadingCircleAnimationComponent size={{ w: "w-12", h: "h-12" }} />
        </div>
      {:then data}
        {#if data.length !== 0}
          {#each data as { uuid, alamat, thumb, tanggal, event, body, kategori_event }}
            <EventCalendarCardComponent
              eventCalendarTitle={event}
              eventCalendarExc={sanitizeHtml(body, { allowedTags: [] })}
              eventCalendarThumb={thumb}
              eventCalendar={tanggal}
              event={uuid}
            />
          {/each}
        {/if}

        {#if data.length === 0}
          <div class="col-span-full flex items-center justify-center">
            Tidak ada event di bulan {months[selectedMonth]}
          </div>
        {/if}
      {/await} -->

      {#await getEvent(selectedMonth, selectedCategory)}
        <div
          class="col-span-full flex items-center justify-center"
          in:fade={{ duration: 200 }}
        >
          <LoadingCircleAnimationComponent size={{ w: "w-12", h: "h-12" }} />
        </div>
      {:then}
        {#if $eventCalendarStore.data}
          {#each $eventCalendarStore.data as { uuid, thumb, tanggal, event, body }}
            <EventCalendarCardComponent
              eventCalendarTitle={event}
              eventCalendarExc={sanitizeHtml(body, { allowedTags: [] })}
              eventCalendarThumb={thumb}
              eventCalendar={tanggal}
              event={uuid}
            />
          {/each}
        {/if}
        {#if $eventCalendarStore.data.length === 0}
          <div class="col-span-full flex items-center justify-center">
            Tidak ada event {`${selectedMonth ? `di bulan ${months[selectedMonth - 1]}` : ""}`}
          </div>
        {/if}
      {/await}
    </div>
  </div>
</div>

{#if contentLoad}
  <div class="fixed top-0 flex mt-12 w-full justify-center items-center">
    <div
      class="flex justify-center drop-shadow-lg items-center rounded-full bg-white w-14 h-14"
      transition:fade={{ duration: 200 }}
    >
      <ContentLoadAnimationComponent size={{ w: "w-10", h: "h-10" }} />
    </div>
  </div>
{/if}
<FooterComponent />
