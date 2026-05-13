<script lang="ts">
	import Paginator from '$lib/components/paginator.svelte';
	import Offsetter from '$lib/components/offsetter.svelte';
	import SearchStudents from './(components)/(search-students)/search-students.svelte';
	import ImportData from './(components)/(import-data)/import-data.svelte';
	import Table from './(components)/(table)/table.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const { data } = $props();
</script>

<section class="flex flex-col gap-5">
	<div class="flex items-center justify-center rounded-md border p-5">
		<div class="mr-auto">
			<h1 class="text-3xl font-bold">Records Vault</h1>
			<p class="text-muted-foreground">Manage your Certificate</p>
		</div>
		<ImportData />
	</div>
	<div class="flex items-center justify-center gap-2">
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
	<Table {data} />
	{#if !data.searchTerm}
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
	{/if}
</section>
