<script>
  import { fade } from "svelte/transition";
  import MenuBurgerLightIcon from "../../assets/svg/MenuBurgerLightIcon.svelte";
  import MenuBurgerOpen from "../../assets/svg/MenuBurgerOpen.svelte";

  import { sidebarState } from "../../lib/store/sidebar/sidebar.state";
  import {
    openSidebar,
    closeSidebar,
    getSidebar,
  } from "../../lib/module/sidebar";

  function revealSidebar() {
    if (!getSidebar().show) {
      openSidebar();
    } else {
      closeSidebar();
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="__top fixed flex lg:hidden rounded-tl-full rounded-bl-full bottom-0 right-0 my-6 px-[1.4rem] py-[1.2rem] bg-[#00d6a1] cursor-pointer"
  on:click={revealSidebar}
>
  {#if !$sidebarState.show}
    <div class="__sidebar-btn-wrapper" in:fade>
      <MenuBurgerLightIcon />
    </div>
  {:else}
    <div class="__sidebar-btn-wrapper" in:fade>
      <MenuBurgerOpen />
    </div>
  {/if}
</div>

<style>
  .__top {
    z-index: 1000;
  }

  .__sidebar-btn-wrapper {
    display: inherit !important;
  }
</style>
