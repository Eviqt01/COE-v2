<script lang="ts">
	import * as Table from '$lib/components/ui/table/index';
	import * as Pagination from '$lib/components/ui/pagination/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import PrintIcon from '@lucide/svelte/icons/printer';
	import SearchIcon from '@lucide/svelte/icons/search';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	let deleteItems = $state<number | null>(null);
	let dialogOpen = $state(false);

	const openDelete = (confirmTanggalin: number) => {
		deleteItems = confirmTanggalin;
		dialogOpen = true;
	};

	const confirmDelete = () => {
		if (deleteItems !== null) {
			schoolRecords = schoolRecords = schoolRecords.filter(
				(_, schoolItem) => schoolItem !== deleteItems
			);
			deleteItems = null;
		}
		dialogOpen = false;
	};

	let schoolRecords = $state([
		{
			lrn: '112331233231',
			fullName: 'Arvin Chrisle Josol',
			gradeSection: '9-Josol',
			issuedDate: '04/21/2026',
			schoolYear: '2026-2027'
		},
		{
			lrn: '123456789101',
			fullName: 'Eviota, Jayjay',
			gradeSection: '9-Josol',
			issuedDate: '04/21/2026',
			schoolYear: '2026-2027'
		},
		{
			lrn: '123456789101',
			fullName: 'Silva',
			gradeSection: '9-Josol',
			issuedDate: '04/21/2026',
			schoolYear: '2026-2027'
		},
		{
			lrn: '123456789101',
			fullName: 'Charles',
			gradeSection: '9-Josol',
			issuedDate: '04/21/2026',
			schoolYear: '2026-2027'
		}
	]);

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
		},
		{
			title: 'Action'
		}
	];

	let searchEngine = $state('');

	const searchItems = $derived(
		schoolRecords.filter((records) =>
			Object.values(records as Record<string, string | number>).some((val) =>
				String(val).toLowerCase().includes(searchEngine.toLowerCase())
			)
		)
	);
</script>

<main class="relative flex min-h-screen w-full flex-col gap-5">
	<section class=" rounded-md border p-5">
		<div class="flex flex-col gap-1">
			<h1 class="text-3xl font-bold tracking-tight">Records Vault</h1>
			<p class=" text-muted-foreground">Manage Certificate</p>
		</div>
	</section>
	<section class="relative flex w-md flex-col gap-1 rounded-md border p-4">
		<h1 class="ml-1 text-sm text-muted-foreground">Search in table Data</h1>
		<div class="relative flex items-center gap-1">
			<SearchIcon class="absolute right-3 size-5" />
			<Input type="text" placeholder="Search students" bind:value={searchEngine} />
		</div>
	</section>
	<section>
		<Table.Root class=" border">
			<Table.Header>
				<Table.Row>
					{#each tableHead as TableHead (TableHead)}
						<Table.Head class="text-center font-bold">{TableHead.title}</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each searchItems as SchoolRecords, tanggal (SchoolRecords)}
					<Table.Row class="text-center font-medium">
						<Table.Cell>{`${tanggal + 1}.`}</Table.Cell>
						<Table.Cell>{SchoolRecords.lrn}</Table.Cell>
						<Table.Cell>{SchoolRecords.fullName}</Table.Cell>
						<Table.Cell>{SchoolRecords.gradeSection}</Table.Cell>
						<Table.Cell>{SchoolRecords.issuedDate}</Table.Cell>
						<Table.Cell>{SchoolRecords.schoolYear}</Table.Cell>
						<Table.Cell class="flex items-center justify-center">
							<Button
								class="cursor-pointer bg-transparent hover:bg-gray-200"
								onclick={() => openDelete(tanggal)}
								><TrashIcon class="size-5 text-red-500" /></Button
							>
							<Button class="cursor-pointer bg-transparent hover:bg-gray-200"
								><PrintIcon class="size-5 text-muted-foreground" /></Button
							>
						</Table.Cell></Table.Row
					>
				{:else}
					<Table.Row>
						<Table.Cell colspan={6} class="py-10 text-center text-muted-foreground">
							No Student Found
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</section>
	<Pagination.Root count={30} page={2}>
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
	<AlertDialog.Root bind:open={dialogOpen}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
				<AlertDialog.Description>
					This action cannot be undone. This will permanently delete your student and remove your
					student data from our servers.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel class="cursor-pointer" onclick={() => (dialogOpen = false)}
					>Cancel</AlertDialog.Cancel
				>
				<AlertDialog.Action class="cursor-pointer" onclick={confirmDelete}
					>Continue</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</main>
