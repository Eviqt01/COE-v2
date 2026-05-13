<script lang="ts">
	import * as Table from '$lib/components/ui/table/index';
	import Paginator from '$lib/components/paginator.svelte';
	import Offsetter from '$lib/components/offsetter.svelte';
	import SearchStudents from './(components)/(search-students)/search-students.svelte';
	import Actions from './(components)/(actions)/actions.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const { data } = $props();

	const tableHead = ['LRN', 'Full Name', 'Grade & Section', 'School Year', 'Action'];
</script>

<section class="flex flex-col gap-5">
	<div class="animate-fade-in-up flex flex-col rounded-md border p-5" style="--stagger: 0;">
		<h1 class="text-3xl font-bold">Archive Records</h1>
		<p class="text-muted-foreground">restore records</p>
	</div>
	<div class="animate-fade-in-up flex items-center justify-center gap-2" style="--stagger: 1;">
		<div>
			<SearchStudents />
		</div>
		<div class="ml-auto">
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
		</div>
	</div>

	<div class="animate-fade-in-scale" style="--stagger: 2;">
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
						<Table.Cell class="text-center">{student.grade_section}</Table.Cell>
						<Table.Cell class="text-center">{student.school_year}</Table.Cell>
						<Table.Cell class="text-center">
							<Actions {student} />
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={5} class="text-center text-muted-foreground text-lg"
							>No Students Records Found</Table.Cell
						>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	{#if !data.searchTerm}
		<div class="animate-fade-in-up" style="--stagger: 3;">
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
