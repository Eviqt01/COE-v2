<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Students } from '$lib/services/students';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import ArchiveRestore from '@lucide/svelte/icons/archive-restore';
	import { buttonVariants } from '$lib/components/ui/button';
	import { StudentsArchiveServiceTB } from '$lib/services/students_archive';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		student: Students;
	}

	const { student }: Props = $props();

	const arhiveServiceFAC = new StudentsArchiveServiceTB(page.data.supabase);

	let restoreLoader = $state(false);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost' })}>
		<Ellipsis />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Group>
			<DropdownMenu.Item
				disabled={restoreLoader}
				onclick={async () => {
					restoreLoader = true;

					const { error } = await arhiveServiceFAC.restoreStudent({
						id: student.id,
						lrn: student.lrn
					});

					if (error) {
						toast.error(error);
					} else {
						toast.success('Student restored successfully.');
					}
					restoreLoader = false;
					await invalidateAll();
				}}
			>
				<ArchiveRestore />
				{restoreLoader ? 'Restoring' : 'Restore'}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
