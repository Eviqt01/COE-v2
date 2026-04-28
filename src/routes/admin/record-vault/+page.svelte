<script lang="ts">
	import * as Table from '$lib/components/ui/table/index';
	import Paginator from '$lib/components/paginator.svelte';
	import Offsetter from '$lib/components/offsetter.svelte';
	import SearchStudents from './(components)/search-students.svelte';

	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const { data } = $props();
</script>

<section class="p-4 md:p-6">
	<div class="flex items-center justify-end">
		<SearchStudents />
	</div>

	<Table.Root>
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

	{#if !data.searchTerm}
		<div class="mt-6 flex flex-wrap items-center justify-between gap-4">
			<Offsetter
				initialOffset={data.offset}
				totalCount={data.count ?? 0}
				onChange={async (o) => {
					const url = new URL(page.url);
					url.searchParams.set('o', String(o));
					const path = url
						.toString()
						.replace(
							page.url.origin,
							''
						) as '/admin/record-vault?p=<string>&o=<string>&search=<string>';
					await goto(resolve(path), { noScroll: true, replaceState: true });
				}}
			/>
			<Paginator
				initialPage={data.what_page}
				totalCount={data.count ?? 0}
				onPageChange={async (p) => {
					const url = new URL(page.url);
					url.searchParams.set('p', String(p));
					const path = url
						.toString()
						.replace(
							page.url.origin,
							''
						) as '/admin/record-vault?p=<string>&o=<string>&search=<string>';
					await goto(resolve(path), { noScroll: true, replaceState: true });
				}}
			/>
		</div>
	{/if}
</section>
