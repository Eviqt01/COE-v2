<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import * as Card from '$lib/components/ui/card/index';
	import { Button } from '$lib/components/ui/button/index';
	import type { ResetPasswordSchema } from '../../schema';
	import { resetPasswordSchema } from '../../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { ShieldCheck, Lock, Loader2 } from '@lucide/svelte';

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

<Card.Root
	class="border-slate-200/60 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80"
>
	<Card.Header class="space-y-1 text-center">
		<div
			class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
		>
			<ShieldCheck class="h-6 w-6" />
		</div>
		<Card.Title class="text-2xl font-bold tracking-tight">Set new password</Card.Title>
		<Card.Description>Your new password must be different from previous ones.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form
			method="POST"
			action="?/resetPasswordEvent&q=reset-password"
			use:enhance
			class="grid gap-4"
		>
			<Form.Field {form} name="newPassword">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>New Password</Form.Label>
						<div class="relative">
							<Lock class="absolute top-3 left-3 size-4 text-muted-foreground" />
							<Input
								type="password"
								{...props}
								bind:value={$formData.newPassword}
								placeholder="Min. 7 characters"
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
								placeholder="Repeat your password"
								class="bg-white/50 pl-10 dark:bg-slate-950/50"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Button type="submit" class="mt-2 w-full font-semibold" disabled={$submitting || $delayed}>
				{#if $submitting || $delayed}
					<Loader2 class="mr-2 size-4 animate-spin" />
					Resetting...
				{:else}
					Reset password
				{/if}
			</Button>
		</form>
	</Card.Content>
</Card.Root>
