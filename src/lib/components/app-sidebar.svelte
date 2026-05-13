<script lang="ts">
	import { resolve } from '$app/paths';
	import DashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import FileOutput from '@lucide/svelte/icons/file-output';
	import RecordsVault from '@lucide/svelte/icons/archive';
	import ArchiveRestore from '@lucide/svelte/icons/archive-restore';
	import RizalIcons from '$lib/images/rizalLogo.png';
	import { onMount } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	const items = [
		{ title: 'Dashboard', path: '/admin', icon: DashboardIcon },
		{ title: 'Create Certificate', path: '/admin/certificate', icon: FileOutput },
		{ title: 'Records Vault', path: '/admin/record-vault', icon: RecordsVault },
		{
			title: 'Archive Records',
			path: '/admin/archive',
			icon: ArchiveRestore
		}
	] as const;

	let creditName = $state('Jayjay Eviota');

	onMount(() => {
		const toggle = () => {
			creditName = creditName === 'Jayjay Eviota' ? 'Jayjay Baguinaon Eviota' : 'Jayjay Eviota';
			setTimeout(toggle, 5000);
		};
		setTimeout(toggle, 5000);
	});
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
							<Sidebar.MenuButton class="transition-all hover:translate-x-1 active:scale-95">
								{#snippet child({ props })}
									<a
										href={resolve(item.path)}
										{...props}
										class="flex gap-2 rounded-md p-2 font-medium hover:bg-gray-400 dark:hover:bg-gray-600"
									>
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
	<Sidebar.Separator />
	<div class="p-2">
		<h1 class="text-center text-xs text-muted-foreground">Developed by: {creditName}</h1>
	</div>
</Sidebar.Root>
