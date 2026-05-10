<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import type { ResetPasswordSchema } from '../../schema';
	import { resetPasswordSchema } from '../../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { ShieldCheck, Lock } from '@lucide/svelte';

	interface Props {
		resetPasswordForm: SuperValidated<Infer<ResetPasswordSchema>>;
	}

	const { resetPasswordForm }: Props = $props();

	// svelte-ignore state_referenced_locally
	const form = superForm(resetPasswordForm, {
		validators: zod4Client(resetPasswordSchema),
		id: crypto.randomUUID(),
		onUpdate: ({ result }) => {
			const { status, data } = result;

			if (status === 200) {
				toast.success(data?.msg || 'Success');
				return;
			}

			if (status === 401 || status === 400) {
				toast.error(data?.msg || 'An error occurred.');
				return;
			}
		}
	});

	const { form: formData, enhance, submitting, delayed } = form;
</script>

<section class="w-full max-w-md">
	<div class="rounded-xl border bg-card p-8 shadow-sm transition-all hover:shadow-md">
		<div class="mb-8 flex flex-col items-center text-center">
			<div
				class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
			>
				<ShieldCheck class="h-6 w-6" />
			</div>
			<h1 class="text-2xl font-bold tracking-tight">Set new password</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				Your new password must be different from previously used passwords.
			</p>
		</div>

		<form method="POST" action="?/resetPasswordEvent&q=reset-password" use:enhance class="flex flex-col gap-4">
			<Form.Field {form} name="newPassword">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>New Password</Form.Label>
						<div class="relative">
							<Lock
								class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								type="password"
								{...props}
								bind:value={$formData.newPassword}
								placeholder="Min. 7 characters"
								class="pl-10"
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
							<Lock
								class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								type="password"
								{...props}
								bind:value={$formData.confirmPassword}
								placeholder="Repeat your password"
								class="pl-10"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button disabled={$submitting || $delayed} class="mt-2 w-full">
				{#if $submitting || $delayed}
					Resetting password...
				{:else}
					Reset password
				{/if}
			</Form.Button>
		</form>
	</div>
</section>
