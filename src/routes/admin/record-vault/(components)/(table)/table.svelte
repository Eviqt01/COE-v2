<script lang="ts">
	import * as Table from '$lib/components/ui/table/index';
	import Actions from '../(actions)/actions.svelte';

	const tableHead = [
		'LRN',
		'Full Name',
		'Gender',
		'Grade & Section',
		'School Year',
		'Adviser',
		'Action'
	];
	const { data } = $props();
</script>

<section>
	<Table.Root class="border">
		<Table.Header>
			<Table.Row>
				{#each tableHead as head (head)}
					<Table.Head class="text-center font-bold">{head}</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.students ?? [] as student, i (student)}
				<Table.Row class="animate-row-in" style="--row-index: {i};">
					<Table.Cell class="text-center font-medium">{student.lrn}</Table.Cell>
					<Table.Cell class="text-center">{student.full_name}</Table.Cell>
					<Table.Cell class="text-center">{student.gender}</Table.Cell>
					<Table.Cell class="text-center">{student.grade_section}</Table.Cell>
					<Table.Cell class="text-center">{student.school_year}</Table.Cell>
					<Table.Cell class="text-center">{student.adviser}</Table.Cell>
					<Table.Cell class="text-center">
						<Actions {student} />
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={7} class="text-center text-muted-foreground text-lg"
						>No Student Record Found</Table.Cell
					>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</section>
