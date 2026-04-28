<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination/index.js';

	interface Props {
		initialPage: number;
		totalCount: number;
		perPage?: number;
		onPageChange: (page: number) => void;
	}

	const { initialPage, totalCount, perPage, onPageChange }: Props = $props();
</script>

<div class="">
	<Pagination.Root count={totalCount} page={initialPage} {perPage} {onPageChange}>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton />
				</Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link {page} isActive={currentPage === page.value}>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.Ellipsis />
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.NextButton />
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
</div>
