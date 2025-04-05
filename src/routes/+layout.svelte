<script>
  // lib
  import { onMount, setContext } from "svelte";

  // components
  import Icon from "$lib/Icon.svelte";
  import Masthead from "$lib/Masthead.svelte";

  // global / contextual state
  import { page } from "$app/state";
  import { init } from "../state";

  // props
  let { children } = $props();

  // local state
  let open = $state(false);

  // derived state
  let isHome = $derived(page.url.pathname === "/modus/");

  // refs

  // event handlers

  // side effects

  // lifecycle events
  onMount(async () => {
    await init();
  });
</script>

<!-- template start -->
<Masthead />

<main>
  {@render children()}
</main>

<!-- template end -->
