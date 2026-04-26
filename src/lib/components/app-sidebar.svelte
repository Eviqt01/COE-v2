<script lang="ts">
	import { resolve } from '$app/paths';
	import DashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import FileOutput from '@lucide/svelte/icons/file-output';
	import RecordsVault from '@lucide/svelte/icons/archive';
	import RizalIcons from '$lib/images/rizal_Icon.jpg';
	import Logout from '@lucide/svelte/icons/log-out';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import Button from './ui/button/button.svelte';

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

	const items = [
		{ title: 'Dashboard', path: '/admin/Dashboard', icon: DashboardIcon },
		{ title: 'Create Certificate', path: '/admin/certificate', icon: FileOutput },
		{ title: 'Records Vault', path: '/admin/record-vault', icon: RecordsVault }
	] as const;
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel
				><div class="flex items-center gap-2">
					<img src={RizalIcons} class="size-6 rounded-full" alt="rizalIcon" />
					<h1>Rizal High School</h1>
				</div></Sidebar.GroupLabel
			>
			<hr />
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={resolve(item.path)} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<div class="mb-4 flex flex-col gap-2">
		<Button
			onclick={handleLogout}
			class="cursor-pointer border-0 bg-gray-300 text-black hover:bg-gray-500"
			>Logout<Logout /></Button
		>
	</div>
</Sidebar.Root>
