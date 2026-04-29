<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />

	<section class="w-full">
		<div class="border-b p-1">
			<Sidebar.Trigger class="cursor-pointer" />
		</div>
		<div class="w-full p-2">
			{@render children()}
		</div>
	</section>
</Sidebar.Provider>
