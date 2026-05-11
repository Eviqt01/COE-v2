<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Logout from '@lucide/svelte/icons/log-out';
	import DarkMode from './(dark-mode)/dark-mode.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { fly, fade } from 'svelte/transition';

	let { children } = $props();
	const handleLogout = async () => {
		if (!page.data.supabase) {
			return;
		}

		const { error } = await page.data.supabase.auth.signOut();

		if (error) {
			toast.error(error.message);
			return;
		}

		invalidateAll();
	};
</script>

<Sidebar.Provider>
	<AppSidebar />

	<section class="w-full">
		<div class="flex items-center justify-center border-b p-1">
			<div class="mr-auto flex items-center justify-center gap-2">
				<Sidebar.Trigger />
				<DarkMode />
			</div>
			<Button
				onclick={handleLogout}
				variant="destructive"
				class="cursor-pointer border-0 hover:bg-gray-200"
			>
				Logout
				<Logout />
			</Button>
		</div>
		<div class="w-full p-2 overflow-x-hidden">
			<ModeWatcher />
			{#key page.url.pathname}
				<div in:fly={{ x: 20, duration: 400, delay: 200 }} out:fade={{ duration: 200 }}>
					{@render children()}
				</div>
			{/key}
		</div>
	</section>
</Sidebar.Provider>

