<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import * as Card from '$lib/components/ui/card/index';
	import { Button } from '$lib/components/ui/button/index';
	import type { ForgotPasswordSchema } from '../../schema';
	import { forgotpasswordSchema } from '../../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { KeyRound, ArrowLeft, Mail, Loader2 } from '@lucide/svelte';

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

<Card.Root
	class="border-slate-200/60 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80"
>
	<Card.Header class="space-y-1 text-center">
		<div
			class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
		>
			<KeyRound class="h-6 w-6" />
		</div>
		<Card.Title class="text-2xl font-bold tracking-tight">Forgot password?</Card.Title>
		<Card.Description>No worries, we'll send you reset instructions.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form
			method="POST"
			action="?/forgotpasswordEvent&q=forgot-password"
			use:enhance
			class="grid gap-4"
		>
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email Address</Form.Label>
						<div class="relative">
							<Mail class="absolute top-3 left-3 size-4 text-muted-foreground" />
							<Input
								{...props}
								bind:value={$formData.email}
								placeholder="name@example.com"
								class="bg-white/50 pl-10 dark:bg-slate-950/50"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Button type="submit" class="w-full font-semibold" disabled={$submitting || $delayed}>
				{#if $submitting || $delayed}
					<Loader2 class="mr-2 size-4 animate-spin" />
					Sending...
				{:else}
					Reset password
				{/if}
			</Button>

			<button
				type="button"
				onclick={BackButton}
				class="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
			>
				<ArrowLeft class="h-4 w-4" />
				Back to log in
			</button>
		</form>
	</Card.Content>
</Card.Root>
