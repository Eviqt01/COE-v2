<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Students } from '$lib/services/students';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import TrashIcon from '@lucide/svelte/icons/trash';

	import { buttonVariants } from '$lib/components/ui/button';
	import { DashboardServiceTB } from '$lib/services/dashboard';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		student: Students;
	}

	const { student }: Props = $props();

	const dashboardService = new DashboardServiceTB(page.data.supabase);

	let loader = $state(false);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost' })}>
		<Ellipsis />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Group>
			<DropdownMenu.Item
				disabled={loader}
				class="text-destructive"
				onclick={async () => {
					loader = true;

					const { error } = await dashboardService.deleteDashboardRecord(student.id);

					if (error) {
						toast.error(error);
					} else {
						toast.success('Issued certificate removed.');
					}
					loader = false;

					await invalidateAll();
				}}
			>
				<TrashIcon />
				{loader ? 'Removing' : 'Remove'}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
