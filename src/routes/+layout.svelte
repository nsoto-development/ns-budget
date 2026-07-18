<script lang="ts">
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
	{@render children()}
</div>
