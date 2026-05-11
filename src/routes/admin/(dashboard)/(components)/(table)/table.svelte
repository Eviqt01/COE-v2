<script lang="ts">
	import * as Table from '$lib/components/ui/table/index';
	import { page } from '$app/state';
	import Actions from '../(actions)/actions.svelte';

	const tableHead = [
		{
			title: 'LRN'
		},
		{
			title: 'Full Name'
		},
		{
			title: 'Grade & Section'
		},
		{
			title: 'Issued Date'
		},
		{
			title: 'School Year'
		},
		{
			title: 'Action'
		}
	];
</script>

<section class="rounded-t-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				{#each tableHead as TableHead (TableHead)}
					<Table.Head class="text-center font-bold">{TableHead.title}</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each page.data.students ?? [] as student (student.id)}
				<Table.Row class="bg-amber-200 text-center font-medium">
					<Table.Cell>{student.lrn}</Table.Cell>
					<Table.Cell>{student.full_name}</Table.Cell>
					<Table.Cell>{student.grade_section}</Table.Cell>
					<Table.Cell>{new Date(student.created_at).toLocaleDateString()}</Table.Cell>
					<Table.Cell>{student.school_year}</Table.Cell>
					<Table.Cell>
						<Actions {student} />
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={6} class="text-center text-lg text-muted-foreground"
						>No certificates issued yet.</Table.Cell
					>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</section>

