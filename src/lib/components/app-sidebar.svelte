<script lang="ts">
	import { resolve } from '$app/paths';
	import DashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import FileOutput from '@lucide/svelte/icons/file-output';
	import RecordsVault from '@lucide/svelte/icons/archive';
	import ArchiveRestore from '@lucide/svelte/icons/archive-restore';
	import RizalIcons from '$lib/images/rizalLogo.png';
	import { fly } from 'svelte/transition';

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
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>
				<div class="flex items-center gap-2 py-4" in:fly={{ x: -20, duration: 600 }}>
					<div
						class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-primary shadow-md"
					>
						<img src={RizalIcons} class="h-full w-full object-cover" alt="rizalIcon" />
					</div>
					<h1 class="text-sm font-bold tracking-tight text-primary">Rizal High School</h1>
				</div>
			</Sidebar.GroupLabel>
			<hr class="opacity-50" />
			<Sidebar.GroupContent class="mt-4">
				<Sidebar.Menu>
					{#each items as item, i (item.title)}
						<div in:fly={{ x: -20, duration: 400, delay: 100 + i * 50 }}>
							<Sidebar.MenuItem>
								<Sidebar.MenuButton class="transition-all hover:translate-x-1 active:scale-95">
									{#snippet child({ props })}
										<a
											href={resolve(item.path)}
											{...props}
											class="flex gap-2 rounded-md p-2 font-medium hover:bg-gray-400 dark:hover:bg-gray-600"
										>
											<item.icon class="size-4" />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						</div>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
