<script lang="ts">
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import FileText from '@lucide/svelte/icons/file-text';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import Archive from '@lucide/svelte/icons/archive';

	const steps = [
		{
			title: '1. Populate Record Vault',
			description:
				'Start by importing your student database. You can add students individually or use our bulk CSV import feature in the Record Vault.',
			icon: UserPlus,
			color: 'bg-blue-500'
		},
		{
			title: '2. Generate Certificates',
			description:
				"Search for a student in the vault, click 'Generate', and customize the certificate. You can instantly print or download the PDF.",
			icon: FileText,
			color: 'bg-amber-500'
		},
		{
			title: '3. Track via Dashboard',
			description:
				'Every issued certificate is logged in the Dashboard. Monitor history, restore records back to the vault, or perform cleanup.',
			icon: LayoutDashboard,
			color: 'bg-emerald-500'
		},
		{
			title: '4. Archive & Compliance',
			description:
				'Access historical records in the Archive section to maintain long-term compliance and student history logs.',
			icon: Archive,
			color: 'bg-purple-500'
		}
	];
</script>

<section id="help" class="bg-background py-24">
	<div class="container mx-auto px-6">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-bold tracking-tight">How to Use the System</h2>
			<p class="mx-auto max-w-2xl text-muted-foreground">
				Get started with the Rizal High School Certificate Management System in four easy steps.
				Designed for efficiency and ease of use.
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#each steps as step (step.title)}
				<div
					class="relative flex flex-col items-center rounded-3xl border bg-card p-8 text-center transition-all hover:border-primary hover:shadow-xl"
				>
					<!-- Icon Circle -->
					<div
						class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl {step.color} text-white shadow-lg shadow-{step.color.split(
							'-'
						)[1]}-200"
					>
						<step.icon class="size-8" />
					</div>

					<h3 class="mb-4 text-xl font-bold">{step.title}</h3>
					<p class="text-sm leading-relaxed text-muted-foreground">
						{step.description}
					</p>

					<!-- Connector Line (for desktop) -->
					<div
						class="absolute top-1/2 -right-4 hidden h-0.5 w-8 bg-muted last:hidden lg:block"
					></div>
				</div>
			{/each}
		</div>

		<!-- Pro Tip Card -->
		<div
			class="mt-16 rounded-3xl border border-primary/10 bg-primary/5 p-8 text-center backdrop-blur-sm"
		>
			<h4 class="mb-2 font-bold text-primary">💡 Pro Tip</h4>
			<p class="text-sm text-muted-foreground">
				You can use the <strong>Quick Search</strong> bar in both the Dashboard and Record Vault to find
				any student by their LRN or Full Name instantly.
			</p>
		</div>
	</div>
</section>
