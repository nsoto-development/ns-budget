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
	#app-shell {
		padding-top: env(safe-area-inset-top, 0px);
		padding-right: env(safe-area-inset-right, 0px);
		padding-bottom: env(safe-area-inset-bottom, 0px);
		padding-left: env(safe-area-inset-left, 0px);
	}

	.chrome-wrap {
		display: flex;
		justify-content: center;
		padding: var(--space-6) var(--space-5) 0;
	}

	@media (max-width: 640px) {
		.chrome-wrap {
			padding: var(--space-4) var(--space-3) 0;
		}
	}
</style>
