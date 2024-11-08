<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let tabItems;
  export let activeItem;
</script>

<div class="__tabs border-b px-5 lg:px-14 pb-5 flex justify-center lg:block">
  <ul class="flex">
    {#each tabItems as item}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li on:click={() => dispatch("tabChange", item)}>
        <div
          class:__active={item === activeItem}
          class="px-4 pb-2 cursor-pointer font-semibold text-md"
        >
          {item}
        </div>
      </li>
    {/each}
  </ul>
</div>

<style>
  .__active {
    border-bottom: 2px solid #00d6a1;
    color: #00d6a1;
  }
</style>
