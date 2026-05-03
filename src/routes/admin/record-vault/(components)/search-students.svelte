<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import BackButton from '@lucide/svelte/icons/arrow-left';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import SearchIcon from '@lucide/svelte/icons/search';
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

<div class="flex w-lg items-center gap-2">
	{#if page.url.searchParams.get('search')}
		<Button onclick={handleBack} class="cursor-pointer bg-green-600 hover:bg-green-700"
			><BackButton />Back</Button
		>
	{/if}
	<div class="g flex w-full items-center">
		<Input
			type="text"
			bind:value={searchTerm}
			class="rounded-r-none "
			placeholder="Search by LRN or Full Name"
		/>

		<Button
			onclick={handleSearch}
			class="cursor-pointer rounded-l-none border border-gray-200 bg-gray-200 text-muted-foreground "
			><SearchIcon class="size-5" /></Button
		>
	</div>
</div>
