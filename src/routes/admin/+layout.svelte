<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Trigger class="cursor-pointer" />
	<main class="w-full p-3">
		<ModeWatcher />
		{@render children()}
	</main>
</Sidebar.Provider>
