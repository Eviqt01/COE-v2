<script lang="ts">
	import * as Table from '$lib/components/ui/table/index';
	import { page } from '$app/state';
	import Actions from '../(actions)/actions.svelte';
	import { fly, fade } from 'svelte/transition';
	import File from '@lucide/svelte/icons/file';
	const tableHead = [
		{ title: 'LRN' },
		{ title: 'Full Name' },
		{ title: 'Grade & Section' },
		{ title: 'Issued Date' },
		{ title: 'School Year' },
		{ title: 'Action' }
	];
</script>

<section class="overflow-hidden rounded-xl border bg-card shadow-sm">
	<Table.Root>
		<Table.Header class="bg-muted/50">
			<Table.Row>
				{#each tableHead as TableHead (TableHead.title)}
					<Table.Head class="text-center font-bold text-primary">{TableHead.title}</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each page.data.students ?? [] as student, i (student.id)}
				<Table.Row class="text-center font-medium transition-colors hover:bg-primary/5">
					<Table.Cell class="font-bold text-primary">
						<div in:fly={{ x: -20, duration: 400, delay: i * 50 }}>{student.lrn}</div>
					</Table.Cell>
					<Table.Cell>
						<div in:fly={{ x: -20, duration: 400, delay: i * 50 }}>{student.full_name}</div>
					</Table.Cell>
					<Table.Cell>
						<div in:fly={{ x: -20, duration: 400, delay: i * 50 }}>{student.grade_section}</div>
					</Table.Cell>
					<Table.Cell>
						<div in:fly={{ x: -20, duration: 400, delay: i * 50 }}>
							{new Date(student.created_at).toLocaleDateString()}
						</div>
					</Table.Cell>
					<Table.Cell>
						<div in:fly={{ x: -20, duration: 400, delay: i * 50 }}>
							<span class="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
								{student.school_year}
							</span>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div in:fly={{ x: -20, duration: 400, delay: i * 50 }}>
							<Actions {student} />
						</div>
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={6} class="h-32 text-center text-lg text-muted-foreground">
						<div class="flex flex-col items-center gap-2" in:fade={{ duration: 400 }}>
							<File class="size-12" />
							No certificates issued yet.
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</section>
