<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import * as Table from '$lib/components/ui/table/index';
	import * as Pagination from '$lib/components/ui/pagination/index';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import SearchIcon from '@lucide/svelte/icons/search';
	import Input from '$lib/components/ui/input/input.svelte';

	const { data } = $props();

	const gotoCertificate = () => {
		goto(resolve('/admin/certificate'));
	};

	const schoolRecords = [
		{
			lrn: 112331233231,
			fullName: 'Arvin Chrisle Josol',
			gradeSection: '9-Josol',
			issuedDate: '04/21/2026',
			schoolYear: '2026-2027'
		},
		{
			lrn: 123456789101,
			fullName: 'Eviota, Jayjay',
			gradeSection: '9-Josol',
			issuedDate: '04/21/2026',
			schoolYear: '2026-2027'
		},
		{
			lrn: 123456789101,
			fullName: 'Silva',
			gradeSection: '9-Josol',
			issuedDate: '04/21/2026',
			schoolYear: '2026-2027'
		},
		{
			lrn: 123456789101,
			fullName: 'Charles',
			gradeSection: '9-Josol',
			issuedDate: '04/21/2026',
			schoolYear: '2026-2027'
		}
	];

	const tableHead = [
		{
			title: 'No.'
		},
		{
			title: 'LRN'
		},
		{
			title: 'Full Name'
		},
		{
			title: 'Grade & Section'
		},
		{
			title: 'Issued Date'
		},
		{
			title: 'School Year'
		}
	];

	let searchEngine = $state('');

	const searchItems = $derived(
		schoolRecords.filter((records) =>
			Object.values(records as Record<string, string | number>).some((hanapValue) =>
				String(hanapValue).toLowerCase().includes(searchEngine.toLowerCase())
			)
		)
	);
</script>

<main class="relative flex min-h-screen flex-col gap-5">
	<section class="flex items-center justify-center rounded-md border p-5">
		<div class="flex flex-col gap-1">
			<h1 class="text-3xl font-bold tracking-tight">
				Welcome, {data.user?.user_metadata.nickname}!
			</h1>
			<p class="text-muted-foreground">Certificate Dashboard</p>
		</div>
		<Button onclick={gotoCertificate} class="ml-auto "><PlusIcon />Create Certificate</Button>
	</section>
	<section class="relative flex w-md flex-col gap-1 rounded-md border p-4">
		<h1 class="ml-1 text-sm text-muted-foreground">Search in table Data</h1>
		<div class="relative flex items-center gap-1">
			<SearchIcon class="absolute right-3 size-5" />

			<Input type="text" placeholder="Search students" bind:value={searchEngine} />
		</div>
	</section>
	<section class="relative flex flex-col gap-2">
		<Table.Root class="border">
			<Table.Header>
				<Table.Row>
					{#each tableHead as TableHead (TableHead)}
						<Table.Head class="text-center font-bold">{TableHead.title}</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each searchItems as SchoolRecords, index (SchoolRecords)}
					<Table.Row class="text-center font-medium">
						<Table.Cell>{`${index + 1}.`}</Table.Cell>
						<Table.Cell>{SchoolRecords.lrn}</Table.Cell>
						<Table.Cell>{SchoolRecords.fullName}</Table.Cell>
						<Table.Cell>{SchoolRecords.gradeSection}</Table.Cell>
						<Table.Cell>{SchoolRecords.issuedDate}</Table.Cell>
						<Table.Cell>{SchoolRecords.schoolYear}</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={6} class="py-10 text-center text-muted-foreground">
							No Student Found
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<Pagination.Root count={20} page={2}>
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
	</section>
</main>
