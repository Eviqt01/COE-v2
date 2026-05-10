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
	import { KeyRound, ArrowLeft, Mail } from '@lucide/svelte';

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

<section class="w-full max-w-md">
	<div class="rounded-xl border bg-card p-8 shadow-sm transition-all hover:shadow-md">
		<div class="mb-8 flex flex-col items-center text-center">
			<div
				class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
			>
				<KeyRound class="h-6 w-6" />
			</div>
			<h1 class="text-2xl font-bold tracking-tight">Forgot password?</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				No worries, we'll send you reset instructions.
			</p>
		</div>

		<form method="POST" action="?/forgotpasswordEvent&q=forgot-password" use:enhance class="flex flex-col gap-4">
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email Address</Form.Label>
						<div class="relative">
							<Mail
								class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								{...props}
								bind:value={$formData.email}
								placeholder="name@example.com"
								class="pl-10"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button disabled={$submitting || $delayed} class="w-full">
				{#if $submitting || $delayed}
					Sending instructions...
				{:else}
					Reset password
				{/if}
			</Form.Button>

			<button
				type="button"
				onclick={BackButton}
				class="flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
			>
				<ArrowLeft class="h-4 w-4" />
				Back to log in
			</button>
		</form>
	</div>
</section>
