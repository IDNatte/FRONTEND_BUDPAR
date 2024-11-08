<script>
  import { fade } from "svelte/transition";
  import { get } from "svelte/store";

  import { imageViewerState } from "../../lib/store/imageViewer/imageViewer.store";
  import { closeViewer } from "../../lib/module/imageViewer";

  import CloseIcon from "../../assets/svg/CloseIcon.svelte";

  export let className;

  function escapePressListener(event) {
    if (event.keyCode === 27 && get(imageViewerState).show === true) {
      closeViewer();
    }
  }
</script>

<svelte:window on:keyup={escapePressListener} />

{#if $imageViewerState.viewer === className}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="__modal {className} {$imageViewerState.show
      ? 'flex'
      : 'hidden'} justify-center items-center fixed w-full h-screen top-0 bg-black/[.7]"
    transition:fade={{ duration: 300 }}
    on:click={closeViewer}
  >
    <CloseIcon />
    <slot name="__viewer-content" />
  </div>
{/if}

<style>
  .__modal {
    z-index: 1000;
  }
</style>
