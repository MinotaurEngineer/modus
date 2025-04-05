<script>
  // external lib (eg. d3 or zod)
  import { onMount } from "svelte";

  // global / contextual state
  import { page } from "$app/state";

  import { getLocalStorage } from "../state";
  import { viewData } from "../state/viewData";

  // local state
  let user = $state(null);
  let schedule = $state(null);

  let view = $derived(viewData({ user, schedule }));

  function updateLocalState() {
    user = getLocalStorage("user");
    schedule = getLocalStorage("schedule");
  }

  onMount(() => {
    window.addEventListener("localstorage:update", updateLocalState, {
      passive: true,
    });

    updateLocalState();

    return () => {
      window.removeEventListener("localstorage:update", updateLocalState);
    };
  });
</script>

<!-- template start -->
{#if !user?.profile?.age}
  <a
    class="missing-data"
    href="user-profile"
    pad="s1:6"
    flex="column"
    gap="s1:4"
    justify="center"
    align="center"
  >
    <h2 font-size="s1:8" font-weight="700">Start using Modus</h2>
    <p font-size="s1:7">
      This app uses your body stats to give you personalised insights.
      <u>Tap here</u>
      to add your info and get started.
    </p>
    <strong>
      No worries—your data stays in your browser, not on some server. (Clear
      your browser data, and it's gone!)
    </strong>
  </a>
{:else}
  <article class="summary" flex="column" justify="between">
    <section flex justify="end" pad="s1:5">
      <div>{view.location}</div>
    </section>
    <section pad="s1:5">
      <h5>Next</h5>
      <h1>{view.day_schedule[view.day_schedule_index].title}</h1>
      <time>{view.day_schedule[view.day_schedule_index].time}</time>
    </section>
  </article>

  <article
    class="schedule"
    grid="s2:1 s3:2"
    pad-inline="s1:5"
    pad-block="s1:8"
    gap="s1:8"
  >
    <div class="schedule-heading" flex="column" gap="s1:4">
      <h2 font-size="s1:8" font-weight="700">Schedule</h2>
      <p font-size="s1:6">
        Your daily plan based on your activity level and goals
      </p>
      <p font-size="s1:4" line-height="1.5">
        Check this daily to see what's up next—your schedule's built from your
        activity level and goals, so it's all about keeping you moving toward
        what you want. Prioritize the big stuff, but don't sweat skipping a
        small task if life gets busy.
      </p>
    </div>
    <div>
      {#each view.day_schedule as event}
        <div
          pad-block="s1:5"
          flex
          gap="s1:7"
          align="center"
          line-height="1"
          class="schedule-item"
        >
          <time font-size="s1:4">{event.time}</time>
          <span font-size="s1:8">{event.title}</span>
        </div>
      {/each}
    </div>
  </article>

  <article
    class="nutrition"
    grid="s1:1 s2:2 s4:3 s5:1"
    pad="s1:5"
    gap="s1:8 s4:5"
  >
    <div grid="s5:6" gap="s1:2">
      {#each view.tdee as item, index}
        <div
          pad-block="s1:2"
          flex="column"
          gap="s1:2"
          span={`s5:${index === 0 ? 2 : 1}`}
        >
          <h6 font-family="mono" class="label">{item.label}</h6>
          <h3>{item.value}</h3>
        </div>
      {/each}
    </div>
    <div grid="s5:6" gap="s1:2">
      {#each view.water as item, index}
        <div
          pad-block="s1:2"
          flex="column"
          gap="s1:2"
          span={`s5:${index === 0 ? 2 : 1}`}
        >
          <h6 font-family="mono" class="label">{item.label}</h6>
          <h3>{item.value}</h3>
        </div>
      {/each}
    </div>
    <div grid="s5:6" gap="s1:2" span="s2:2 s3:1">
      {#each view.macros as item, index}
        <div
          pad-block="s1:2"
          flex="column"
          gap="s1:2"
          span={`s5:${index === 0 ? 2 : 1}`}
        >
          <h6 font-family="mono" class="label">{item.label}</h6>
          <h3>{item.value}</h3>
          <small class="tip">Protein / Fat / Carbs</small>
        </div>
      {/each}
    </div>
  </article>

  <article
    class="performance"
    grid="s2:1 s4:2"
    pad-inline="s1:5"
    pad-block="s1:8"
    gap="s1:8"
  >
    <div class="performance-heading" flex="column" gap="s1:4">
      <h2 font-size="s1:8" font-weight="700">Heartrate zones</h2>
      <p font-size="s1:6">Custom zones based on your resting HR</p>
      <p font-size="s1:4" line-height="1.5">
        Use these zones to pace yourself—low zones for endurance, high ones for
        pushing limits. Match your workout intensity to the zone that fits your
        goal, and track how long you stay in each to see what's working.
      </p>
    </div>
    <div>
      {#each view.hr_zones as zone, index}
        <div
          pad-block="s1:5"
          flex
          gap="s1:7"
          align="center"
          line-height="1"
          class="performance-item"
        >
          <span font-size="s1:4">Zone {index + 1}</span>
          <span font-size="s1:8" class="range">
            {zone.range[0]} &mdash; {zone.range[1]}
          </span>
          <span>{zone.title}</span>
        </div>
      {/each}
    </div>
  </article>

  <article
    class="cardio"
    grid="s1:1 s3:3"
    gap="s1:4"
    pad-inline="s1:5"
    pad-block="s1:8"
  >
    {#each view.cardio_performance as item}
      <div
        class="cardio-item"
        pad="s1:8"
        flex="column"
        gap="s1:1"
        justify="end"
      >
        <div font-size="s1:4">{item.label}</div>
        <div font-size="s1:4" class="value">{item.value}</div>
        <div font-size="s1:4">{item.unit}</div>
      </div>
    {/each}
  </article>

  <article
    class="physiology"
    grid="s2:1 s4:2"
    pad-inline="s1:5"
    pad-block="s1:8"
    gap="s1:8"
  >
    <div class="physiology-heading" flex="column" gap="s1:4">
      <h2 font-size="s1:8" font-weight="700">Muscular potential</h2>
      <p font-size="s1:6">
        This shows your maximum lean muscle mass based on your current weight
        and body fat percentage.
      </p>
      <p font-size="s1:4" line-height="1.5">
        These numbers estimate how much muscle you could build at different body
        fat levels. Lower fat percentages highlight leaner potential, while
        higher ones account for added mass.
      </p>
    </div>
    <div>
      {#each view.muscular_potential as potential}
        <div
          pad-block="s1:5"
          flex
          gap="s1:7"
          align="center"
          line-height="1"
          class="physiology-item"
        >
          <span>{potential.ratio}</span>
          <span font-size="s1:8">
            {potential.weight}
          </span>
        </div>
      {/each}
    </div>
  </article>

  <article
    class="weight"
    grid="s1:1 s2:2"
    gap="s1:4"
    pad-inline="s1:5"
    pad-block="s1:8"
  >
    {#each view.mass as item}
      <div
        class="weight-item"
        pad="s1:8"
        flex="column"
        gap="s1:1"
        justify="end"
      >
        <div font-size="s1:4">{item.label}</div>
        <div font-size="s1:4" class="value">{item.value}</div>
        <div font-size="s1:4">{item.unit}</div>
      </div>
    {/each}
  </article>
{/if}

<!-- template end -->

<style>
  .missing-data {
    background-color: var(--color-slate-3);
    color: var(--color-slate-12);
    height: calc(100svh - 84px);

    & > * {
      max-width: 40ch;
    }

    p {
      line-height: 1.4;
    }

    &:hover {
      text-decoration: none;
    }
  }
  .summary {
    height: 38svh;
    min-height: 320px;
    & > * {
      width: 100%;
      max-width: 420mm;
      margin-inline: auto;
    }
  }

  .schedule {
    .schedule-heading {
      padding-block-end: var(--gap-3);
    }
    .schedule-item {
      border-bottom: 1px solid var(--color-slate-5);
    }
  }

  .performance {
    .performance-heading {
      padding-block-end: var(--gap-3);
    }
    .performance-item {
      border-bottom: 1px solid var(--color-slate-5);
    }

    .range {
      flex-grow: 1;
      text-align: start;
    }
  }

  .nutrition {
    .label,
    .tip {
      color: var(--color-slate-9);
    }
  }

  .cardio {
    .cardio-item {
      border: 1px solid var(--color-slate-4);
      border-radius: var(--gap-3);

      .value {
        font-size: 500%;
        font-weight: 500;
      }
    }
  }

  .physiology {
    .physiology-heading {
      padding-block-end: var(--gap-3);
    }
    .physiology-item {
      border-bottom: 1px solid var(--color-slate-5);
    }
  }

  .weight {
    .weight-item {
      border: 1px solid var(--color-slate-4);
      border-radius: var(--gap-3);

      .value {
        font-size: 500%;
        font-weight: 500;
      }
    }
  }
</style>
