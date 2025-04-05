<script>
  const {
    name = "wordmark",
    width = 24,
    height = 24,
    color = "currentColor",
    title = null,
  } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={width || height}
  height={height || width}
  {color}
  class="Icon"
>
  <title>{title || name}</title>
  <use href={"#icon-" + name} />
</svg>

<style>
  .Icon {
    pointer-events: none;
  }
</style>
