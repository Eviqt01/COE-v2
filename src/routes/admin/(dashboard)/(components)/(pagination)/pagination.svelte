<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination/index';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const count = $derived(page.data.count ?? 0);
	const perPage = $derived(page.data.limit ?? 10);
	const currentPage = $derived(page.data.page ?? 1);
</script>

<section>
	<Pagination.Root
		{count}
		{perPage}
		page={currentPage}
		onPageChange={async (p) => {
			const url = new URL(page.url);
			url.searchParams.set('p', String(p));
			const path = url.toString().replace(page.url.origin, '') as '/admin';
			await goto(resolve(path), { noScroll: true, replaceState: true });
		}}
	>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton />
				</Pagination.Item>
				{#each pages as p (p.key)}
					{#if p.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link page={p} isActive={currentPage === p.value}>
								{p.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.NextButton />
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
</section>
