<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Students } from '$lib/services/students';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import { buttonVariants } from '$lib/components/ui/button';
	import { StudentsServiceTB } from '$lib/services/students';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		student: Students;
	}

	const { student }: Props = $props();

	const studentServiceFAC = new StudentsServiceTB(page.data.supabase);

	let deleteLoader = $state(false);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost' })}>
		<Ellipsis />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Group>
			<DropdownMenu.Item
				disabled={deleteLoader}
				onclick={async () => {
					deleteLoader = true;

					const { error } = await studentServiceFAC.deleteStudent({
						id: student.id,
						lrn: student.lrn
					});

					if (error) {
						toast.error(error);
					}
					deleteLoader = false;

					await invalidateAll();
				}}
			>
				{deleteLoader ? 'Deleting' : 'Delete'}
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onclick={() => {
					console.log(student);
				}}>Print</DropdownMenu.Item
			>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
