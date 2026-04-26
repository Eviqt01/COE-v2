<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import type { ForgotPasswordSchema } from '../../schema';
	import { forgotpasswordSchema } from '../../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	interface Props {
		forgotpasswordForm: SuperValidated<Infer<ForgotPasswordSchema>>;
	}

	const { forgotpasswordForm }: Props = $props();

	// svelte-ignore state_referenced_locally

	const form = superForm(forgotpasswordForm, {
		validators: zod4Client(forgotpasswordSchema),
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

	const BackButton = () => {
		goto(resolve('/login'));
	};

	const { form: formData, enhance, submitting, delayed } = form;
</script>

<section class="w-full max-w-sm rounded-lg p-2">
	<form method="POST" action="?/forgotpasswordEvent" use:enhance class="mt-5 flex flex-col gap-2">
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} bind:value={$formData.email} placeholder="Enter your email" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button disabled={$submitting || $delayed}>
			{#if $submitting || $delayed}
				Please wait...
			{:else}
				Send reset link
			{/if}
		</Form.Button>
		<Form.Button onclick={BackButton}>Back to Login</Form.Button>
	</form>
</section>
