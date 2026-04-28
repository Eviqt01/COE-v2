<script lang="ts">
	import * as Table from '$lib/components/ui/table/index';
	import Paginator from '$lib/components/paginator.svelte';

	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const { data } = $props();
</script>

<section class="p-4 md:p-6">
	<Table.Root>
		<Table.Caption>A list of your recent invoices.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[100px]">LRN</Table.Head>
				<Table.Head>Full Name</Table.Head>
				<Table.Head>School Year</Table.Head>
				<Table.Head class="text-end">Grade & Section</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.students as student (student)}
				<Table.Row>
					<Table.Cell class="font-medium">{student.lrn}</Table.Cell>
					<Table.Cell>{student.full_name}</Table.Cell>
					<Table.Cell>{student.school_year}</Table.Cell>
					<Table.Cell class="text-end">{student.grade_section}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<div class="">
		<Paginator
			initialPage={1}
			totalCount={data.count ?? 0}
			onPageChange={async (p) => {
				const url = new URL(page.url);
				url.searchParams.set('p', String(p));
				const path = url
					.toString()
					.replace(page.url.origin, '') as '/admin/record-vault?p=<string>&o=<string>';
				await goto(resolve(path), { noScroll: true, replaceState: true });
			}}
		/>
	</div>
</section>
