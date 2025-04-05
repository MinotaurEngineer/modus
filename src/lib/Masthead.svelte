<script>
  // external lib (eg. d3 or zod)

  // components
  import Icon from "$lib/Icon.svelte";

  // global / contextual state
  import { page } from "$app/state";

  // props
  const { name = "demo" } = $props();

  // local state
  let open = $state(false);

  // derived state
  let isHome = $derived(page.url.pathname === "/modus/");

  // refs

  // actions

  // event handlers

  // side effects
</script>

<!-- template start -->
<nav grid="s1:3" pad="s1:5" align="center">
  <a href={isHome ? "user-profile" : "/modus"} flex align="center" gap="s1:2">
    <Icon name={isHome ? "user-profile" : "arrow-left"} />
    <span class="label">{isHome ? "Profile" : "Home"}</span>
  </a>
  <a href="/modus" flex justify="center">
    <Icon width={96} height={16} title="Modus" />
  </a>
  <a href="muscle-atlas" flex align="center" gap="s1:2" justify="end">
    <span class="label">Atlas</span>
    <Icon name="bacon" />
  </a>
</nav>

<!-- template end -->

<style>
  nav {
    inset-block-start: 0;
    position: sticky;
    mix-blend-mode: difference;
    color: var(--color-white);

    a {
      text-decoration: none;
    }

    .label {
      line-height: 1;
    }
  }
</style>
