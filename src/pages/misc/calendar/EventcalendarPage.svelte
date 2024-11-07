<script>
  console.log("loaded");
  import { API, BASEURI } from "../../../lib/config";
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

<div class="__content-page-event-calendar">
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

  <div class="pt-36 relative">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem aut nihil ab
    optio accusantium fugit iste obcaecati perferendis quod, reprehenderit quas
    ratione nisi qui odio animi neque officia! Commodi, consequuntur?
  </div>
</div>
