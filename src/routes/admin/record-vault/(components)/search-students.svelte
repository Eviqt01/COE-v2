<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let searchTerm = $state('');

	const handleSearch = async () => {
		if (!searchTerm.length) return;

		const url = new URL(page.url);
		url.searchParams.set('search', searchTerm);

		const path = url
			.toString()
			.replace(page.url.origin, '') as '/admin/record-vault?p=<string>&o=<string>&search=<string>';
		await goto(resolve(path), { replaceState: true, noScroll: true });
	};

	const handleBack = async () => {
		const url = new URL(page.url);
		url.searchParams.delete('search');

		const path = url
			.toString()
			.replace(page.url.origin, '') as '/admin/record-vault?p=<string>&o=<string>';
		await goto(resolve(path), { replaceState: true, noScroll: true });
	};
</script>

<div class="flex flex-wrap items-center gap-2">
	{#if page.url.searchParams.get('search')}
		<Button onclick={handleBack}>Back to results</Button>
	{/if}
	<div class="grid grid-cols-[1fr_auto] items-center gap-2">
		<Input type="text" bind:value={searchTerm} placeholder="Search by fullname" />

		<Button onclick={handleSearch}>Search</Button>
	</div>
</div>
