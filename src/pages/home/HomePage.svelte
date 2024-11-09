<script>
  import { onMount } from "svelte";
  import { link } from "svelte-spa-router";
  import { fade } from "svelte/transition";

  import { BASEURI, API } from "../../lib/config";

  import SliderLoadingAnimationComponent from "../../components/animation/SliderLoadingAnimationComponent.svelte";
  import LoadingCircleAnimationComponent from "../../components/animation/LoadingCircleAnimationComponent.svelte";
  import BannerLoadAnimationComponent from "../../components/animation/BannerLoadAnimationComponent.svelte";

  import MapButtonComponent from "../../components/floatingbutton/MapButtonComponent.svelte";
  import BannerSliderComponent from "../../components/slider/bannerSliderComponent.svelte";
  import SearchCardComponent from "../../components/searchcard/SearchCardComponent.svelte";
  import EventCardComponent from "../../components/card/EventCardComponent.svelte";
  import TourListComponent from "../../components/tour/TourListComponent.svelte";
  import NewsCardComponent from "../../components/card/NewsCardComponent.svelte";
  import SliderComponent from "../../components/slider/SliderComponent.svelte";
  import FooterComponent from "../../components/footer/FooterComponent.svelte";
  import ChevronDownIcon from "../../assets/svg/ChevronDownIcon.svelte";

  let getData = fetchData();
  let tourCategoryId = null;
  let tourLoading = true;
  let categories = [];
  let tourList = [];

  async function fetchData() {
    let news = await fetch(`${API}/articles?paginate=3`);
    let activity = await fetch(
      `${API}/articleByTag?tag=Event+Wisata&paginate=3`,
    );
    let popularTour = await fetch(`${API}/tourist-attractions/popular`);
    let slider = await fetch(`${API}/sliders`);
    let banner = await fetch(`${API}/banner`);

    if (
      popularTour.status === 200 &&
      news.status === 200 &&
      activity.status === 200 &&
      slider.status === 200 &&
      banner.status === 200
    ) {
      let popularList = await popularTour.json();
      let activityData = await activity.json();
      let newsData = await news.json();
      let sliderData = await slider.json();
      let bannerData = await banner.json();

      return {
        newsData: newsData.data.data,
        activityData: activityData.data.articles,
        popularList: popularList.data,
        slidersImage: sliderData.data,
        bannerImage: bannerData.data,
      };
    } else {
      throw new Error("Could not fetch data !");
    }
  }

  async function getCategories() {
    let category = await fetch(`${API}/categories`);

    if (category.status === 200) {
      let categoriesData = await category.json();
      return {
        category: categoriesData.data.data,
      };
    } else {
      throw new Error("Cannot fetch data !");
    }
  }

  async function getTourListByCategory(id) {
    let tour = await fetch(
      `${API}/tourist-attractions/${id}/byCategory?paginate=4`,
    );

    if (tour.status === 200) {
      let tourData = await tour.json();
      return tourData.data.data;
    } else {
      throw new Error("cannot fetch data !");
    }
  }

  function getInitCategory() {
    getCategories().then((data) => {
      tourCategoryId = data.category[0].uuid;
      categories = data.category;
      getTourListByCategory(tourCategoryId).then((data) => {
        tourLoading = false;
        tourList = data;
      });
    });
  }

  function changeContent(e, id, name) {
    let ddTextTarget = document.querySelector(".__dd-text");
    let categoryElement = e.target;
    tourLoading = true;
    tourList = [];
    getTourListByCategory(id).then((data) => {
      ddTextTarget.innerText = name;
      tourLoading = false;
      tourList = data;
    });

    categoryElement.blur();
  }

  onMount(() => {
    getInitCategory();
  });
</script>

<!-- meta tag for SEO -->
<svelte:head>
  <title>Halaman Utama | Dinas Kebudayaan dan Pariwisata Kabupaten Tapin</title>
  <meta
    name="description"
    content="Halaman utama website Dinas Kebudayaan dan Pariwisata Kabupaten Tapin "
  />
  <meta
    name="keywords"
    content="disbudpar kab tapin, disbudpar tapin, dinas kebudayaan, disbud tapin"
  />
  <meta
    name="author"
    content="Dinas Kebudayaan dan Pariwisata Kabupaten Tapin"
  />
  <meta name="robots" content="index, follow" />

  <!-- svelte-ignore component-name-lowercase -->
  <link rel="canonical" href={`${BASEURI}#/`} />
</svelte:head>
<!-- meta tag for SEO -->

<div in:fade={{ duration: 500 }}>
  <div class="relative">
    {#await getData}
      <SliderLoadingAnimationComponent />
    {:then data}
      <SliderComponent bgImage={data.slidersImage} />
    {/await}
    <SearchCardComponent />
    <MapButtonComponent />
  </div>
  <div
    class="content __tour-object pt-5 lg:pt-[11rem] pb-[5rem] px-[2rem] lg:px-[7rem]"
  >
    <div class="flex flex-col justify-center md:justify-between md:flex-row">
      <div class="block">
        <h3 class="capitalize font-bold text-[#18263e] pb-5">top wisata</h3>
        <h1 class="font-bold text-3xl pb-8">Wisata Top Pencarian</h1>
      </div>
      <div class="flex justify-center items-center pb-5 md:pb-0">
        <div class="group relative">
          <button
            class="__dropdown-button border-2 w-[13.5rem] h-auto flex justify-between rounded-full border-transparent bg-[#00d6a1] text-white font-bold px-5 py-3 duration-500 hover:text-white hover:border-transparent hover:bg-[#00a97f]"
          >
            <span class="__dd-text"> Kategori Wisata </span>
            <ChevronDownIcon />
          </button>
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <div
            tabindex="0"
            class="__dropdown border-2 bg-slate-100 invisible border-transparent rounded w-60 absolute right-0 top-full transition-all opacity-0 group-focus-within:visible group-focus-within:outline-none group-focus-within:opacity-100 group-focus-within:translate-y-4"
          >
            <ul class="py-1">
              {#if categories.length > 0}
                {#each categories as { uuid, name }}
                  <li>
                    <a
                      href="#!"
                      on:click|preventDefault={(e) =>
                        changeContent(e, uuid, name)}
                      class="block px-4 py-2 text-[#00d6a1] hover:text-white duration-300 hover:bg-[#00d6a1]"
                    >
                      {name}
                    </a>
                  </li>
                {/each}
              {:else}
                <li>
                  <a
                    href="#!"
                    class="block px-4 py-2 text-[#00d6a1] hover:text-white duration-300 hover:bg-[#00d6a1]"
                  >
                    tidak dapat memuat data kategori !
                  </a>
                </li>
              {/if}
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-x-7 gap-y-11 md:gap-y-14 pb-24"
    >
      {#if tourLoading}
        <div
          class="col-span-full flex items-center justify-center py-32"
          in:fade={{ duration: 200 }}
        >
          <LoadingCircleAnimationComponent size={{ w: "w-12", h: "h-12" }} />
        </div>
      {/if}

      {#if tourList.length > 0}
        <TourListComponent data={tourList} />
      {/if}
      {#if tourList.length === 0}
        <span>Masih Belum ada data wisata</span>
      {/if}
    </div>

    <div class="text-center">
      <a
        href="/tour-list"
        class="border-2 rounded-full border-[#00d6a1] bg-white text-[#00d6a1] font-bold px-5 py-3 duration-500 hover:text-white hover:border-[#e0e0e0] hover:bg-[#00d6a1]"
        use:link>Lihat Selengkapnya</a
      >
    </div>
  </div>

  <!-- promotional banner (changeable) -->
  {#await getData}
    <BannerLoadAnimationComponent lgHeight="h-[477px]" />
  {:then data}
    <BannerSliderComponent bgImage={data.bannerImage} />
  {/await}

  <!-- promotional banner (changeable) -->

  <div class="px-7 lg:px-36">
    <div class="content __news pt-10 md:pt-32">
      <div class="__wrapper flex justify-between items-center">
        <div class="__section-title">
          <h1 class="font-bold text-3xl pb-2">Kabar Berita</h1>
          <h4 class="capitalize text-2xl font-semibold">disbudpar</h4>
        </div>
        <a class="font-bold text-md underline" href="/news-list" use:link
          >Lihat Semua</a
        >
      </div>
      <div class="pt-10 pb-32">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x gap-y-20"
        >
          {#await getData}
            <div
              class="col-span-full flex items-center justify-center py-32"
              in:fade={{ duration: 200 }}
            >
              <LoadingCircleAnimationComponent
                size={{ w: "w-12", h: "h-12" }}
              />
            </div>
          {:then data}
            {#each data.newsData as { created_at, title, thumb, slug, excerpt }}
              <div in:fade={{ duration: 200 }}>
                <NewsCardComponent
                  createdDate={created_at}
                  newsTitle={title}
                  newsThumb={thumb}
                  newsExc={excerpt}
                  newsSlug={slug}
                />
              </div>
            {/each}
          {/await}
        </div>
      </div>
    </div>

    <div class="content __activity">
      <div class="__wrapper flex justify-between items-center">
        <div class="__section-title">
          <h1 class="font-bold text-3xl pb-2">Event</h1>
          <h4 class="capitalize text-2xl font-semibold">disbudpar</h4>
        </div>
        <a class="font-bold text-md underline" href="/event-list" use:link
          >Lihat Semua</a
        >
      </div>

      <div class="pt-10 pb-32">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x gap-y-20"
        >
          {#await getData}
            <div
              class="col-span-full flex items-center justify-center py-32"
              in:fade={{ duration: 200 }}
            >
              <LoadingCircleAnimationComponent
                size={{ w: "w-12", h: "h-12" }}
              />
            </div>
          {:then data}
            {#each data.activityData as { created_at, title, thumb, slug, excerpt }}
              <div in:fade={{ duration: 200 }}>
                <EventCardComponent
                  createdDate={created_at}
                  eventTitle={title}
                  eventThumb={thumb}
                  eventExc={excerpt}
                  eventSlug={slug}
                />
              </div>
            {/each}
          {/await}
        </div>
      </div>
    </div>

    <div class="content __activity">
      <div class="__wrapper flex justify-between items-center">
        <div class="__section-title">
          <h1 class="font-bold text-3xl pb-2">Youtube Highlight</h1>
          <h4 class="capitalize text-2xl font-semibold">disbudpar</h4>
        </div>
      </div>

      <div class="pt-10 pb-32">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20"
          in:fade={{ duration: 200 }}
        >
          <iframe
            class="rounded-lg w-full"
            src="https://www.youtube.com/embed/fvhj8UfPsjY?si=slpXPhx38TYCCyCD"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />

          <iframe
            class="rounded-lg w-full"
            src="https://www.youtube.com/embed/_WmZAPCXfjc?si=2i26k4AWQLJliaH1"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />

          <iframe
            class="rounded-lg w-full"
            src="https://www.youtube.com/embed/iM-FC0y1Pco?si=Wa4sry5hZ7SE3q1O"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />
        </div>
      </div>
    </div>
  </div>

  <FooterComponent />
</div>

<style>
  .__dropdown {
    z-index: 999;
  }
</style>
