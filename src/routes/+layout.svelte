<script lang="ts">
	import AppHeader from '$lib/components/AppHeader.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>ns-budget — cash flow scheduler</title>
	<meta
		name="description"
		content="Project recurring income and bills with calendar-accurate cash flow."
	/>
</svelte:head>

<div id="app-shell">
	<div class="chrome-wrap">
		<AppHeader />
	</div>
	{@render children()}
</div>

<style>
	.chrome-wrap {
		display: flex;
		justify-content: center;
		padding: var(--space-6) var(--space-5) 0;
	}
</style>
