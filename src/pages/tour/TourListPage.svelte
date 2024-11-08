<script>
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  import { API, ASSETS, BASEURI } from "../../lib/config";

  import LoadingCircleAnimationComponent from "../../components/animation/LoadingCircleAnimationComponent.svelte";
  import ContentLoadAnimationComponent from "../../components/animation/ContentLoadAnimationComponent.svelte";
  import RestoCardComponent from "../../components/card/RestoCardComponent.svelte";
  import HotelCardComponent from "../../components/card/HotelCardComponent.svelte";
  import FooterComponent from "../../components/footer/FooterComponent.svelte";
  import TourContentCard from "../../components/card/TourContentCard.svelte";
  import TabsComponent from "../../components/tabs/TabsComponent.svelte";
  import ChevronDownIcon from "../../assets/svg/ChevronDownIcon.svelte";

  let tabItems = ["Wisata", "Penginapan", "Rumah Makan"];
  let showContentLoader = true;
  let activeTabs = "Wisata";
  let showLoader = false;
  let categoryName = "";
  let currentPage = 0;
  let categories = [];
  let categoryId = "";
  let listData = [];
  let nextPage = 0;
  let lastPage = 0;
  let perPage = 4;

  let observer = new IntersectionObserver(
    (event) => {
      if (lastPage !== currentPage) {
        let [entries] = event;
        if (entries.isIntersecting) {
          showLoader = true;

          switch (activeTabs) {
            case "Wisata":
              if (categoryId !== "") {
                fetchData(`tourist-attractions/${categoryId}/byCategory`).then(
                  (data) => {
                    listData = data.listData;
                    nextPage = data.nextPage;
                    lastPage = data.lastPage;
                    currentPage = data.currentPage;
                    showLoader = false;
                  },
                );
              } else {
                fetchNextData(nextPage, "tourist-attractions").then((data) => {
                  listData.push.apply(listData, data.listData);
                  listData = listData;
                  nextPage = data.nextPage;
                  lastPage = data.lastPage;
                  currentPage = data.currentPage;
                  showLoader = false;
                });
              }

              break;

            case "Penginapan":
              fetchNextData(nextPage, "hotels").then((data) => {
                listData.push.apply(listData, data.listData);
                listData = listData;
                nextPage = data.nextPage;
                lastPage = data.lastPage;
                currentPage = data.currentPage;
                showLoader = false;
              });

              break;

            case "Rumah Makan":
              fetchNextData(nextPage, "foods").then((data) => {
                listData.push.apply(listData, data.listData);
                listData = listData;
                nextPage = data.nextPage;
                lastPage = data.lastPage;
                currentPage = data.currentPage;
                showLoader = false;
              });

              break;
          }
        } else {
          showLoader = false;
        }
      }
    },
    {
      root: document.querySelector(".__content-page-tour"),
      rootMargin: "0px",
      threshold: 0.5,
    },
  );

  function initData() {
    fetchCategoryData().then((data) => {
      categories = data;
    });

    fetchData("tourist-attractions").then((data) => {
      listData = data.listData;
      nextPage = data.nextPage;
      lastPage = data.lastPage;
      currentPage = data.currentPage;
      showContentLoader = false;
    });
  }

  function changeTabs(event) {
    showContentLoader = true;
    if (event.detail === "Wisata") {
      if (categoryId !== "") {
        fetchData(`tourist-attractions/${categoryId}/byCategory`).then(
          (data) => {
            listData = data.listData;
            nextPage = data.nextPage;
            lastPage = data.lastPage;
            currentPage = data.currentPage;
            showContentLoader = false;
            activeTabs = event.detail;
          },
        );
      } else {
        fetchData("tourist-attractions").then((data) => {
          listData = data.listData;
          nextPage = data.nextPage;
          lastPage = data.lastPage;
          currentPage = data.currentPage;
          showContentLoader = false;
          activeTabs = event.detail;
        });
      }
    } else if (event.detail === "Penginapan") {
      fetchData("hotels").then((data) => {
        listData = data.listData;
        nextPage = data.nextPage;
        lastPage = data.lastPage;
        currentPage = data.currentPage;

        showContentLoader = false;
        activeTabs = event.detail;
      });
    } else if (event.detail === "Rumah Makan") {
      fetchData("foods").then((data) => {
        listData = data.listData;
        nextPage = data.nextPage;
        lastPage = data.lastPage;
        currentPage = data.currentPage;

        showContentLoader = false;
        activeTabs = event.detail;
      });
    }
  }

  async function fetchCategoryData() {
    let fetchCateg = await fetch(`${API}/categories`);

    if (fetchCateg.status === 200) {
      let categoryData = await fetchCateg.json();

      return categoryData.data.data;
    } else {
      throw new Error("cannot fetch data !");
    }
  }

  async function fetchData(endpoint) {
    let list = await fetch(`${API}/${endpoint}?paginate=${perPage}&page=1`);

    if (list.status === 200) {
      let listData = await list.json();

      return {
        listData: listData.data.data,
        nextPage: listData.data.current_page + 1,
        lastPage: listData.data.last_page,
        currentPage: listData.data.current_page,
      };
    } else {
      throw new Error("Cannot fetch data !");
    }
  }

  async function fetchNextData(next, endpoint) {
    let list = await fetch(
      `${API}/${endpoint}?paginate=${perPage}&page=${next}`,
    );

    if (list.status === 200) {
      let listData = await list.json();
      return {
        listData: listData.data.data,
        nextPage: listData.data.current_page + 1,
        lastPage: listData.data.last_page,
        currentPage: listData.data.current_page,
      };
    } else {
      throw new Error("Cannot fetch data !");
    }
  }

  function changeCategory(e, id, name) {
    showContentLoader = true;
    categoryId = id;
    categoryName = name;

    fetchData(`tourist-attractions/${id}/byCategory`).then((data) => {
      listData = data.listData;
      nextPage = data.nextPage;
      lastPage = data.lastPage;
      currentPage = data.currentPage;
      showContentLoader = false;
    });

    e.target.blur();
  }

  onMount(() => {
    observer.observe(document.querySelector(".__footer"));
    initData();
  });

  onDestroy(() => {
    observer.unobserve(document.querySelector(".__footer"));
  });
</script>

<!-- meta tag for SEO -->
<svelte:head>
  <title>Daftar Wisata | Dinas Kebudayaan dan Pariwisata Kabupaten Tapin</title>
  <meta
    name="description"
    content="Daftar lokasi wisata di kabupaten tapin dari Dinas Kebudayaan dan Pariwisata Kabupaten Tapin"
  />
  <meta
    name="keywords"
    content="daftar wisata disbudpar kab tapin, daftar lokasi wisata disbudpar tapin"
  />
  <meta
    name="author"
    content="Dinas Kebudayaan dan Pariwisata Kabupaten Tapin"
  />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={`${BASEURI}#/tour-list`} />
</svelte:head>
<!-- meta tag for SEO -->

<div class="__content-page-tour" in:fade={{ duration: 500 }}>
  <div class="pt-36 relative pb-5">
    <img
      src="/assets/images/placeholder/i-love-tapin.jpg"
      alt="placeholder"
      class="w-full h-[512px] object-cover"
    />
    <div class="__content-title absolute bottom-12 px-7 md:px-14 lg:px-32">
      <div class="flex pb-3">
        <h3
          class="text-white uppercase font-bold text-md md:text-xl decoration-[#00d6a1] decoration-2 underline underline-offset-4"
        >
          kabupaten
        </h3>
        <h3
          class="text-white uppercase font-bold text-md md:text-xl decoration-[#00d6a1] decoration-2 underline underline-offset-4 pl-3"
        >
          tapin
        </h3>
      </div>
      <div class="__content-subtitle">
        <h1 class="text-white font-bold text-xl md:text-3xl uppercase">
          daftar wisata
        </h1>
      </div>
    </div>
  </div>

  <TabsComponent {tabItems} activeItem={activeTabs} on:tabChange={changeTabs} />

  {#if showContentLoader}
    <div class="w-full h-screen pb-24">
      <div
        class="h-screen flex items-center justify-center py-32"
        in:fade={{ duration: 200 }}
      >
        <LoadingCircleAnimationComponent size={{ w: "w-12", h: "h-12" }} />
      </div>
    </div>
  {/if}

  {#if activeTabs === "Wisata"}
    <div class="py-5 lg:px-32 flex justify-center lg:justify-end">
      <div class="group relative">
        <button
          class="__dropdown-button border-2 w-[13.5rem] h-auto flex justify-between rounded-full border-transparent bg-[#00d6a1] text-white font-bold px-5 py-3 duration-500 hover:text-white hover:border-transparent hover:bg-[#00a97f]"
        >
          {#if categoryName !== ""}
            <span class="__dd-text">{categoryName}</span>
          {:else}
            <span class="__dd-text">Kategori Wisata</span>
          {/if}
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
                      changeCategory(e, uuid, name)}
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

    <div
      in:fade={{ duration: 500 }}
      class="__content-tour-list pt-5 pb-32 md:px-10 lg:px-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-x-7 gap-y-11 md:gap-y-14"
    >
      {#if listData.length > 0}
        {#each listData as { thumb, name, address, uuid }}
          <TourContentCard
            imageUrl={`${ASSETS}/${thumb}`}
            tourTitle={name}
            tourAddress={address}
            tourDetail={uuid}
          />
        {/each}
      {:else}
        <h1>Data wisata masih belum ada</h1>
        <!-- else content here -->
      {/if}
    </div>
  {:else if activeTabs === "Penginapan"}
    <div
      in:fade={{ duration: 500 }}
      class="__content-hotel-list pt-5 pb-32 md:px-10 lg:px-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-x-7 gap-y-11 md:gap-y-14"
    >
      {#each listData as { thumb, name, address, uuid }}
        <HotelCardComponent
          imageUrl={`${ASSETS}/${thumb}`}
          hotelTitle={name}
          hotelAddress={address}
          hotelDetail={uuid}
        />
      {/each}
    </div>
  {:else if activeTabs === "Rumah Makan"}
    <div
      in:fade={{ duration: 500 }}
      class="__content-resto-list pt-5 pb-32 md:px-10 lg:px-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-x-7 gap-y-11 md:gap-y-14"
    >
      {#each listData as { thumb, name, address, uuid }}
        <RestoCardComponent
          imageUrl={`${ASSETS}/${thumb}`}
          restoTitle={name}
          restoAddress={address}
          restoDetail={uuid}
        />
      {/each}
    </div>
  {/if}

  {#if showLoader}
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
</div>

<style>
  .__dropdown {
    z-index: 1000;
  }

  :global(.svelte-tabs__tab-list) {
    display: flex !important;
    justify-content: start;
    padding-left: 4rem !important;
    padding-bottom: 1rem !important;
  }

  :global(.svelte-tabs li.svelte-tabs__tab) {
    text-transform: uppercase;
    font-weight: bold;
  }

  :global(.svelte-tabs li.svelte-tabs__selected) {
    border-bottom-color: #00d6a1;
    color: #00d6a1;
  }

  @media (max-width: 640px) {
    :global(.svelte-tabs__tab-list) {
      justify-content: center;
      padding-left: 0px !important;
    }
  }
</style>
