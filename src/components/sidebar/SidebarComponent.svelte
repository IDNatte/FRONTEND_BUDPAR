<script>
  import { push } from "svelte-spa-router";
  import { fly } from "svelte/transition";

  import SearchDarkIcon from "../../assets/svg/SearchDarkIcon.svelte";
  import LoginDarkIcon from "../../assets/svg/LoginDarkIcon.svelte";
  import MapDarkIcon from "../../assets/svg/MapDarkIcon.svelte";
  import WordIcon from "../../assets/svg/WordIcon.svelte";

  import { sidebarState } from "../../lib/store/sidebar/sidebar.state";
  import { closeSidebar } from "../../lib/module/sidebar";
  import { openModal } from "../../lib/module/modal";
  import CalendarIcon from "../../assets/svg/CalendarIcon.svelte";

  function goHere(path) {
    push(`/${path}`);
    closeSidebar();
  }

  function openSearchModal(modalName) {
    openModal(modalName);
    closeSidebar();
  }
</script>

{#if $sidebarState.show === true}
  <div
    transition:fly={{ x: -200 }}
    class="__top sm:flex lg:hidden fixed inset-0 z-40 bg-white w-7/12 shadow {$sidebarState.show
      ? 'visible'
      : 'obstructured'}"
  >
    <div class="__sidebar-wrapper pt-[5rem] w-full">
      <ul>
        <li>
          <a
            class="__sidebar-item flex items-center py-4 w-full duration-300 border-b-[1px] hover:bg-[#e0e0e0]"
            href="#!"
            on:click|preventDefault={() => {
              openSearchModal("__navbarSearch");
            }}
          >
            <div class="__sidebar-item-icon pl-5">
              <SearchDarkIcon />
            </div>
            <span class="__sidebar-item-content pl-5">Cari</span>
          </a>
        </li>
        <li>
          <a
            class="__sidebar-item flex items-center py-4 w-full duration-300 border-b-[1px] hover:bg-[#e0e0e0]"
            href="#!"
            on:click|preventDefault={() => goHere("event-calendar")}
          >
            <div class="__sidebar-item-icon pl-5">
              <CalendarIcon />
            </div>
            <span class="__sidebar-item-content pl-5">Even Kalender</span>
          </a>
        </li>
        <li>
          <a
            class="__sidebar-item flex items-center py-4 w-full duration-300 border-b-[1px] hover:bg-[#e0e0e0]"
            href="#!"
            on:click|preventDefault={() => goHere("tour-list")}
          >
            <div class="__sidebar-item-icon pl-5">
              <WordIcon />
            </div>
            <span class="__sidebar-item-content pl-5">Tempat Wisata</span>
          </a>
        </li>
        <li>
          <a
            class="__sidebar-item flex items-center py-4 w-full duration-300 border-b-[1px] hover:bg-[#e0e0e0]"
            href="/map"
            on:click|preventDefault={() => goHere("map")}
          >
            <div class="__sidebar-item-icon pl-5">
              <MapDarkIcon />
            </div>
            <span class="__sidebar-item-content pl-5">Map Wisata</span>
          </a>
        </li>
        <li>
          <a
            class="__sidebar-item flex items-center py-4 w-full duration-300 border-b-[1px] hover:bg-[#e0e0e0]"
            href="https://admin.demopaariwisata.tapinkab.go.id/"
            target="_blank"
          >
            <div class="__sidebar-item-icon pl-5">
              <LoginDarkIcon />
            </div>
            <span class="__sidebar-item-content pl-5">Halaman Admin</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
{/if}

<style>
  .__top {
    z-index: 1000;
  }

  .__sidebar-item-icon {
    display: inherit !important;
  }
</style>
