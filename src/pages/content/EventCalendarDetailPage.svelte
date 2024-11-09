<script>
  import { querystring, link, location } from "svelte-spa-router";
  import { fade, fly } from "svelte/transition";
  import { get } from "svelte/store";

  import { filter } from "lodash";

  import { eventCalendarStore } from "../../lib/store/eventCalendar/eventCalendare.store";
  import { ASSETS, BASEURI } from "../../lib/config";

  import MapCardComponent from "../../components/card/MapCardComponent.svelte";
  import FooterComponent from "../../components/footer/FooterComponent.svelte";

  import RupiahCircleGreenIcon from "../../assets/svg/RupiahCircleGreenIcon.svelte";
  import ClockCircleGreenIcon from "../../assets/svg/ClockCircleGreenIcon.svelte";
  import PinCircleGreenIcon from "../../assets/svg/PinCircleGreenIcon.svelte";
  import MapFoldIcon from "../../assets/svg/MapFoldIcon.svelte";
  import FlyIcon from "../../assets/svg/FlyIcon.svelte";

  $: title = new URLSearchParams($querystring).get("title");
  let event = new URLSearchParams($querystring).get("event");

  const data = filter(get(eventCalendarStore).data, { uuid: event })[0];
</script>

<svelte:head>
  <!-- svelte-ignore component-name-lowercase -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
  />

  <meta
    name="description"
    content="Even {data.kategori_event
      .name}, {data.event} yang di adakan di kabupaten tapin dari Dinas Kebudayaan dan Pariwisata Kabupaten Tapin"
  />

  <!-- svelte-ignore component-name-lowercase -->
  <link rel="canonical" href={`${BASEURI}#${$location}?${$querystring}`} />

  <title>
    {title} | Dinas Kebudayaan dan Pariwisata Kabupaten Tapin
  </title>
</svelte:head>

<div class="__content-page-activity" in:fade={{ duration: 200 }}>
  <div class="pt-36 relative">
    <img
      src={`${ASSETS}/${data.thumb}`}
      alt={title}
      class="w-full h-[512px] object-cover"
      in:fly={{ y: -20 }}
    />
    <div
      class="__content-title __shadow absolute bottom-0 w-full px-7 md:px-14 lg:px-32"
    >
      <div class="py-5">
        <div class="__content-subtitle">
          <h1 class="text-white font-bold text-xl md:text-3xl uppercase">
            {data.event}
          </h1>
        </div>

        <div class="flex pb-3">
          <h3
            class="text-white uppercase font-bold text-md md:text-xl decoration-[#00d6a1] decoration-2 underline underline-offset-4 pr-2 pt-3"
          >
            <span>#{data.kategori_event.name}</span>
          </h3>
        </div>
      </div>
    </div>
  </div>

  <div
    class="__content-main grid grid-cols-12 px-7 gap-y-8 lg:gap-y-16 md:px-7 lg:px-32 py-7 lg:py-24"
  >
    <div class="col-span-full lg:col-span-8">
      <h2 class="font-bold text-2xl uppercase">
        {data.event}
      </h2>
      <p class="py-5 lg:py-24">
        {@html data.body}
      </p>

      <!-- <div class="overflow-x-auto">
        <table class="table-auto w-full">
          <thead>
            <tr class="bg-gray-200">
              <th class="px-4 py-2">Tanggal kegiatan</th>
              <th class="px-4 py-2">Email</th>
              <th class="px-4 py-2">Phone</th>
              <th class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b">
              <td class="px-4 py-2">John Doe</td>
              <td class="px-4 py-2">john@example.com</td>
              <td class="px-4 py-2">123-456-7890</td>
              <td class="px-4 py-2">
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2">Jane Smith</td>
              <td class="px-4 py-2">jane@example.com</td>
              <td class="px-4 py-2">987-654-3210</td>
              <td class="px-4 py-2">
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="font-bold text-2xl uppercase">Tanggal kegiatan</h2>
      <p class="py-5 lg:py-18">
        {new Date(data.tanggal).toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p> -->
    </div>

    <div class="col-span-full lg:col-span-4 lg:px-7">
      <div class="w-full flex items-center py-5">
        <MapFoldIcon />
        <h3 class="font-bold text-2xl pl-4">Maps</h3>
      </div>
      <div class="__minimap-wrapper pb-7">
        <MapCardComponent
          objectType="tours"
          latlng={[`${data.lat}`, `${data.lon}`]}
        />
      </div>
      <a
        href="/direction?{new URLSearchParams({
          type: 'tours',
          title: `${data.event}`,
          lat: `${data.lat}`,
          lng: `${data.lon}`,
        }).toString()}"
        class="rounded-lg bg-[#00d6a1] flex w-full items-center justify-center py-3"
        use:link
      >
        <FlyIcon />
        <span class="text-white pl-5">Open Map</span>
      </a>

      <div class="__content-info mt-6 pt-5 border-t">
        <div class="__address flex items-center">
          <PinCircleGreenIcon />
          <div class="__address-text pl-3">
            <h3 class="font-bold">Alamat</h3>
            <span>{data.alamat}</span>
          </div>
        </div>

        <div class="__open-hours flex items-center pt-5">
          <ClockCircleGreenIcon />
          <div class="__open-hours-text pl-3">
            <h3 class="font-bold">Waktu event</h3>
            <span
              >{new Date(data.tanggal).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span
            >
          </div>
        </div>

        <div class="__open-hours flex items-center pt-5">
          <RupiahCircleGreenIcon />
          <div class="__open-hours-text pl-3">
            <h3 class="font-bold">Biaya</h3>
            <span
              >{new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(data.biaya)}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <FooterComponent />
</div>

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
