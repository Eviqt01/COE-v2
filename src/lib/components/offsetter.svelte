<script lang="ts">
	import { onMount } from 'svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { buttonVariants } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';

	interface Props {
		onChange: (offset: number) => void;
		initialOffset: number;
		totalCount: number;
	}

	const { onChange, initialOffset, totalCount }: Props = $props();

	const MIN_PAGE_SIZE = 10;
	const PAGE_SIZE_PRESETS = [10, 20, 50, 100] as const;

	// svelte-ignore state_referenced_locally
	let activeOffset = $state(Math.max(MIN_PAGE_SIZE, initialOffset));

	const listOffsetsBasedOnTotalCount = (count: number): number[] => {
		if (count <= 0) return [];
		const eligible = PAGE_SIZE_PRESETS.filter((n) => n <= count);
		if (eligible.length > 0) return eligible.slice(0, 4);
		return [MIN_PAGE_SIZE];
	};

	const setPageSize = (raw: number) => {
		const n = Math.max(MIN_PAGE_SIZE, Number.isFinite(raw) ? raw : NaN);
		activeOffset = n;
		onChange(n);
	};

	onMount(() => {
		if (initialOffset < MIN_PAGE_SIZE) {
			setPageSize(MIN_PAGE_SIZE);
		}
	});
</script>

<!--
@component
Page-size control for tables: preset choices (10 / 20 / 50 / 100) are trimmed so none exceed
`totalCount` (e.g. total 30 offers 10 and 20 only). If `totalCount` is below 10, the only preset
offered is 10 (the minimum page size). Custom numeric input also updates the value.

@prop {number} initialOffset - Starting page size (internal state only; changing the prop later does not reset state).
@prop {number} totalCount - Total rows in the dataset; caps which presets appear.
@prop {(offset: number) => void} onChange - Fires when the user picks a preset or commits a new value in the custom field.

@example
```svelte
<script lang="ts">
    import Offsetter from '$lib/components/externals/table/components/offsetter/offsetter.svelte';
</script>

<Offsetter
    initialOffset={10}
    totalCount={30}
    onChange={(offset) => console.log(offset)}
/>
```
-->

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>
		{activeOffset} rows out of {totalCount}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			{#each listOffsetsBasedOnTotalCount(totalCount) as size (size)}
				<DropdownMenu.Item onclick={() => setPageSize(size)}>
					{size} rows
				</DropdownMenu.Item>
			{/each}
			<DropdownMenu.Separator />
			<DropdownMenu.Label>Custom Rows</DropdownMenu.Label>

			<div class="grid grid-cols-2 items-center gap-2">
				<Input
					type="number"
					bind:value={activeOffset}
					onchange={() => setPageSize(Number(activeOffset))}
				/>
				<p class="text-sm text-foreground">rows</p>
			</div>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
