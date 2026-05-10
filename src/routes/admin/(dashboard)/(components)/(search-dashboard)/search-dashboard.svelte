<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import BackButton from '@lucide/svelte/icons/undo-2';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let searchTerm = $state(page.url.searchParams.get('search') ?? '');

	const handleSearch = async () => {
		if (!searchTerm.length) return;

		const url = new URL(page.url);
		url.searchParams.set('search', searchTerm);

		const path = url.toString().replace(page.url.origin, '') as '/admin';
		await goto(resolve(path), { replaceState: true, noScroll: true });
	};

	const handleBack = async () => {
		const url = new URL(page.url);
		url.searchParams.delete('search');

		const path = url.toString().replace(page.url.origin, '') as '/admin';
		await goto(resolve(path), { replaceState: true, noScroll: true });
	};
</script>

<div class="flex w-lg items-center gap-2">
	{#if page.url.searchParams.get('search')}
		<Button onclick={handleBack} variant="outline" class="cursor-pointer" size="sm">
			<BackButton />Back
		</Button>
	{/if}
	<div class="flex w-full items-center">
		<Input
			type="text"
			bind:value={searchTerm}
			class="rounded-r-none"
			placeholder="Search issued certificates"
		/>

		<Button onclick={handleSearch} variant="outline" class="cursor-pointer rounded-l-none">
			<SearchIcon class="size-5" />
		</Button>
	</div>
</div>
