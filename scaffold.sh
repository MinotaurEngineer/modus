#!/bin/bash

# Define the base directory for SvelteKit routes
ROUTES_DIR="src/routes"

# Create the routes directory if it doesn't exist
mkdir -p "$ROUTES_DIR"

# List of route names
ROUTES=(
  "user-profile"
)

CREATED_COUNT=0
SKIPPED_COUNT=0

for route in "${ROUTES[@]}"; do
  mkdir -p "$ROUTES_DIR/$route"

  PAGE_FILE="$ROUTES_DIR/$route/+page.svelte"

  if [ -f "$PAGE_FILE" ]; then
    echo "Skipped $PAGE_FILE (already exists)"
    ((SKIPPED_COUNT++))
  else
    cat << EOF > "$PAGE_FILE"
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
  let demoRef

  // actions
  function Action(node, data) {
    console.log(node, data)
  }

  // event handlers
  function handler(event) {
    console.log(event)
  }


  // side effects
  $effect(()=>{})
</script>

<!-- template start -->

<div>Contextual HTML template</div>

<!-- template end -->

<style></style>
EOF
    echo "Created $PAGE_FILE"
    ((CREATED_COUNT++))
  fi
done

echo "Route population complete under $ROUTES_DIR!"
echo "Created: $CREATED_COUNT files, Skipped: $SKIPPED_COUNT files"
