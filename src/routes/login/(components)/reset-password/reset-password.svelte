<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import type { ResetPasswordSchema } from '../../schema';
	import { resetPasswordSchema } from '../../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

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
				toast.success(data.msg);
				return;
			}

			if (status === 401) {
				toast.error(data.msg);
				return;
			}
		}
	});

	const { form: formData, enhance, submitting, delayed } = form;
</script>

<section>
	<form
		method="POST"
		action="?/resetPasswordEvent"
		use:enhance
		class="flex max-w-screen min-w-sm flex-col gap-2 rounded-md border p-3"
	>
		<h1 class="mb-3 text-center text-lg font-bold text-muted-foreground">Reset Password</h1>
		<Form.Field {form} name="newPassword">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>New Password</Form.Label>
					<Input
						type="password"
						{...props}
						bind:value={$formData.newPassword}
						placeholder="Enter your new password"
					/>
				{/snippet}
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="confirmPassword">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Confirm Password</Form.Label>
					<Input
						type="password"
						{...props}
						bind:value={$formData.confirmPassword}
						placeholder="Confirm your new password"
					/>
				{/snippet}
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>

		<Form.Button disabled={$submitting || $delayed}>
			{#if $submitting || $delayed}
				resetting password...
			{:else}
				Reset Password
			{/if}
		</Form.Button>
	</form>
</section>
