<script lang="ts">
	import Paginator from '$lib/components/paginator.svelte';
	import Offsetter from '$lib/components/offsetter.svelte';
	import SearchDashboard from './(components)/(search-dashboard)/search-dashboard.svelte';
	import TableData from './(components)/(table)/table.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/button/button.svelte';
	import PlusIcon from '@lucide/svelte/icons/plus';

	const { data } = $props();

	const gotoCertificate = () => {
		goto(resolve('/admin/certificate'));
	};
</script>

<section class="flex flex-col gap-5">
	<div
		class="animate-fade-in-up flex items-center justify-center rounded-md border p-5"
		style="--stagger: 0;"
	>
		<div class="mr-auto">
			<h1 class="text-3xl font-bold">
				Welcome, {data.user?.user_metadata.nickname}!
			</h1>
			<p class="text-muted-foreground">Manage your Issued Certificates</p>
		</div>
		<Button onclick={gotoCertificate} variant="outline" class="cursor-pointer">
			<PlusIcon class="mr-2 size-4" />
			Create Certificate
		</Button>
	</div>

	<div class="animate-fade-in-up flex items-center justify-center gap-2" style="--stagger: 1;">
		<div>
			<SearchDashboard />
		</div>
		<div class="ml-auto">
			<Offsetter
				initialOffset={data.offset}
				totalCount={data.count ?? 0}
				onChange={async (o) => {
					const url = new URL(page.url);
					url.searchParams.set('o', String(o));
					const path = url.toString().replace(page.url.origin, '') as '/admin';
					await goto(resolve(path), { noScroll: true, replaceState: true });
				}}
			/>
		</div>
	</div>

	<div class="animate-fade-in-scale" style="--stagger: 2;">
		<TableData />
	</div>

	{#if !data.searchTerm}
		<div class="animate-fade-in-up" style="--stagger: 3;">
			<Paginator
				initialPage={data.what_page}
				totalCount={data.count ?? 0}
				onPageChange={async (p) => {
					const url = new URL(page.url);
					url.searchParams.set('p', String(p));
					const path = url.toString().replace(page.url.origin, '') as '/admin';
					await goto(resolve(path), { noScroll: true, replaceState: true });
				}}
			/>
		</div>
	{/if}
</section>
