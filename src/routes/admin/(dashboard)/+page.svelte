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
	import { fly, fade } from 'svelte/transition';

	const { data } = $props();

	const gotoCertificate = () => {
		goto(resolve('/admin/certificate'));
	};
</script>

<section class="flex flex-col gap-5">
	<div 
		class="flex items-center justify-center rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
		in:fly={{ y: 20, duration: 600 }}
	>
		<div class="mr-auto">
			<h1 class="text-3xl font-bold tracking-tight">
				Welcome, <span class="text-primary">{data.user?.user_metadata.nickname}</span>!
			</h1>
			<p class="text-muted-foreground">Manage and issue student certificates from one place.</p>
		</div>
		<Button onclick={gotoCertificate} variant="default" class="cursor-pointer shadow-lg active:scale-95 transition-all">
			<PlusIcon class="mr-2 size-4" />
			Create Certificate
		</Button>
	</div>

	<div 
		class="flex items-center justify-center gap-2"
		in:fly={{ y: 20, duration: 600, delay: 200 }}
	>
		<div class="flex-1 max-w-md">
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

	<div in:fade={{ duration: 800, delay: 400 }}>
		<TableData />
	</div>

	{#if !data.searchTerm}
		<div in:fade={{ duration: 600, delay: 600 }}>
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

