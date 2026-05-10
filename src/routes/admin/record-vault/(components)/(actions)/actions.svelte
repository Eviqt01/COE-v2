<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Students } from '$lib/services/students';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import PrintIcon from '@lucide/svelte/icons/printer';
	import { buttonVariants } from '$lib/components/ui/button';
	import { StudentsServiceTB } from '$lib/services/students';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { invalidateAll, goto } from '$app/navigation';
	import { resolve } from '$app/paths';

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
				onclick={() => {
					const params = new URLSearchParams({
						lrn: student.lrn,
						fullName: student.full_name,
						gradeSection: student.grade_section,
						schoolYear: student.school_year,
						id: student.id
					});
					goto(resolve(`/admin/certificate?${params.toString()}`));
				}}
			>
				<PrintIcon />
				Print
			</DropdownMenu.Item>
			<DropdownMenu.Item
				disabled={deleteLoader}
				class="text-destructive"
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
				><TrashIcon />
				{deleteLoader ? 'Deleting' : 'Delete'}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
