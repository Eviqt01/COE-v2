<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import * as Card from '$lib/components/ui/card/index';
	import { Button } from '$lib/components/ui/button/index';
	import { completeProfileSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { User, Lock, UserPlus, Loader2, Sparkles } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';
	import RizalLogo from '$lib/images/rizal_Icon.jpg';

	const { data } = $props();

	// svelte-ignore state_referenced_locally
	const form = superForm(data.form, {
		validators: zod4Client(completeProfileSchema),
		onUpdate: ({ result }) => {
			if (result.type === 'failure') {
				toast.error(result.data?.msg || 'Failed to complete profile');
			}
		}
	});

	const { form: formData, enhance, submitting, delayed } = form;
</script>

<main
	class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50/50 px-4 dark:bg-slate-950"
>
	<!-- Premium Background Effects -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="absolute top-[10%] left-[10%] h-[40%] w-[40%] animate-pulse rounded-full bg-primary/10 blur-[120px]"
		></div>
		<div
			class="absolute top-[60%] right-[5%] h-[35%] w-[35%] rounded-full bg-blue-500/10 blur-[100px]"
		></div>
	</div>

	<div class="z-10 w-full max-w-md" in:fade={{ duration: 600 }}>
		<!-- Branding -->
		<div class="mb-8 flex flex-col items-center gap-3 text-center">
			<div
				class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
			>
				<img src={RizalLogo} alt="Rizal Logo" class="h-full w-full rounded-xl object-cover" />
			</div>
			<div>
				<h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
					Complete Your Registration
				</h1>
				<p class="text-sm font-medium text-muted-foreground">
					Welcome! Please set your details for {data.email}
				</p>
			</div>
		</div>

		<div in:fly={{ y: 20, duration: 400 }}>
			<Card.Root
				class="border-slate-200/60 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80"
			>
				<Card.Header class="space-y-1 text-center">
					<Card.Title
						class="flex items-center justify-center gap-2 text-xl font-bold tracking-tight"
					>
						<Sparkles class="size-5 text-primary" />
						Setup Your Profile
					</Card.Title>
					<Card.Description>Set your display name and password to join</Card.Description>
				</Card.Header>
				<Card.Content>
					<form method="POST" use:enhance class="grid gap-4">
						<div class="grid gap-4">
							<Form.Field {form} name="username">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Username</Form.Label>
										<div class="relative">
											<User class="absolute top-3 left-3 size-4 text-muted-foreground" />
											<Input
												{...props}
												bind:value={$formData.username}
												placeholder="alex_dev"
												class="bg-white/50 pl-10 dark:bg-slate-950/50"
											/>
										</div>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>

						<Form.Field {form} name="password">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Password</Form.Label>
									<div class="relative">
										<Lock class="absolute top-3 left-3 size-4 text-muted-foreground" />
										<Input
											type="password"
											{...props}
											bind:value={$formData.password}
											placeholder="••••••••"
											class="bg-white/50 pl-10 dark:bg-slate-950/50"
										/>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="confirmPassword">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Confirm Password</Form.Label>
									<div class="relative">
										<Lock class="absolute top-3 left-3 size-4 text-muted-foreground" />
										<Input
											type="password"
											{...props}
											bind:value={$formData.confirmPassword}
											placeholder="••••••••"
											class="bg-white/50 pl-10 dark:bg-slate-950/50"
										/>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Button
							type="submit"
							class="mt-2 w-full font-semibold"
							disabled={$submitting || $delayed}
						>
							{#if $submitting || $delayed}
								<Loader2 class="mr-2 size-4 animate-spin" />
								Finalizing...
							{:else}
								<UserPlus class="mr-2 size-4" />
								Complete Registration
							{/if}
						</Button>
					</form>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</main>
