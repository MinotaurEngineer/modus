<script>
  import { onMount } from "svelte";
  import { EMPTY, getLocalStorage, setLocalStorage } from "../../state";
  import * as metricsFunctions from "../../state/metrics";

  const { data } = $props();

  let profile = $state(EMPTY.USER.profile);

  let errors = $state({});

  onMount(() => {
    const user = getLocalStorage("user");
    if (user) {
      profile = { ...user.profile };
    }
  });

  $effect(() => {
    const user = getLocalStorage("user");
    if (user) {
      const updatedUser = {
        ...user,
        profile: { ...user.profile, ...profile },
      };

      const metrics = Object.fromEntries(
        Object.entries(user.metrics).map(([key, value]) => {
          try {
            return [key, metricsFunctions[key](updatedUser, data)];
          } catch (error) {
            return [key, null];
          }
        }),
      );
      setLocalStorage("user", {
        ...updatedUser,
        metrics: {
          ...user.metrics,
          ...metrics,
        },
      });
    }
  });
</script>

<form flex="column" gap="s1:3" pad-block="s1:8" pad-inline="s1:5">
  <fieldset flex="column" gap="s1:6" pad-block="s1:3">
    <legend font-size="s1:6">Physical Info</legend>
    <label flex="column" gap="s1:2">
      <span class="title">Age</span>
      <input
        type="number"
        bind:value={profile.age}
        min="16"
        max="80"
        required
        font-size="s1:6"
        pad-block="s1:2"
        line-height="1"
      />
    </label>
    <label flex="column" gap="s1:2">
      <span class="title">Gender</span>
      <select
        bind:value={profile.gender}
        required
        font-size="s1:6"
        pad-block="s1:2"
        line-height="1"
      >
        {#each data.constants.genders as { name }}
          <option>{name}</option>
        {/each}
      </select>
    </label>
    <label flex="column" gap="s1:2">
      <span class="title">Height (cm)</span>
      <input
        type="number"
        bind:value={profile.height}
        min="50"
        max="300"
        required
        font-size="s1:6"
        pad-block="s1:2"
        line-height="1"
      />
    </label>
    <label flex="column" gap="s1:2">
      <span class="title">Weight (kg)</span>
      <input
        type="number"
        bind:value={profile.weight}
        min="50"
        max="300"
        required
        font-size="s1:6"
        pad="s1:2"
        line-height="1"
      />
    </label>
  </fieldset>

  <fieldset flex="column" gap="s1:6" pad-block="s1:3">
    <legend font-size="s1:6">Health Metric</legend>
    <label flex="column" gap="s1:2">
      <span class="title">Resting Heartrate (bpm)</span>
      <input
        type="number"
        bind:value={profile.hr_rest}
        min="30"
        max="100"
        font-size="s1:6"
        pad-block="s1:2"
        line-height="1"
      />
    </label>
    <label flex="column" gap="s1:2">
      <span class="title">Bodyfat Percentage</span>
      <select
        bind:value={profile.bodyfat}
        required
        font-size="s1:6"
        pad-block="s1:2"
        line-height="1"
      >
        {#each data.constants.bodyfat_ranges as { name, value }}
          <option {value}>{name}</option>
        {/each}
      </select>
    </label>
  </fieldset>

  <fieldset flex="column" gap="s1:6" pad-block="s1:3">
    <legend font-size="s1:6">Fitness Preferences</legend>
    <label flex="column" gap="s1:2">
      <span class="title">Training Age (years)</span>
      <input
        type="number"
        bind:value={profile.trainingYears}
        min="0"
        max="40"
        font-size="s1:6"
        pad-block="s1:2"
        line-height="1"
      />
    </label>
    <label flex="column" gap="s1:2">
      <span class="title">Activity Level</span>
      <select
        bind:value={profile.activityLevel}
        required
        font-size="s1:6"
        pad-block="s1:2"
        line-height="1"
      >
        {#each data.constants.activity_levels as { name, value }}
          <option {value}>{name}</option>
        {/each}
      </select>
    </label>
    <label flex="column" gap="s1:2">
      <span class="title">Activity Goal</span>
      <select
        bind:value={profile.activityGoal}
        required
        font-size="s1:6"
        pad-block="s1:2"
        line-height="1"
      >
        {#each data.constants.activity_goals as { name }}
          <option>{name}</option>
        {/each}
      </select>
    </label>
  </fieldset>

  <fieldset
    flex="column"
    gap="s1:1"
    pad="s1:4"
    class="location"
    aria-label="Location"
  >
    <span font-size="s1:4">{profile.location?.city}</span>
    <span font-size="s1:2">{profile.location?.country}</span>
  </fieldset>
</form>

<style>
  form {
    max-width: fit-content;
    margin-inline: auto;

    input,
    select {
      background-color: transparent;
      border-width: 0 0 1px;
      border-color: var(--color-slate-6);
      width: 100%;
    }

    fieldset {
      border: none;

      .title {
        color: var(--color-slate-11);
      }
    }

    fieldset legend {
      display: block;
      position: static;
      color: var(--color-slate-10);
    }

    .location {
      background-color: var(--color-slate-3);
      border-radius: var(--gap-2);
    }
  }
</style>
