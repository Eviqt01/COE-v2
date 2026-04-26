<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import type { RegisterSchema } from '../../schema';
	import { registerschema } from '../../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';

	interface Props {
		registerForm: SuperValidated<Infer<RegisterSchema>>;
	}

	const { registerForm }: Props = $props();

	// svelte-ignore state_referenced_locally

	const form = superForm(registerForm, {
		validators: zod4Client(registerschema),
		id: crypto.randomUUID(),
		onUpdate: ({ result }) => {
			const { status, data } = result;

			if (status === 200) {
				toast.success(data.msg);
			}
			if (status === 400) {
				toast.error(data.msg);
			}
		}
	});

	const { form: formData, enhance, submitting, delayed } = form;
</script>

<section class="flex w-full max-w-sm flex-col gap-1 rounded-lg border p-2">
	<div class="text-center">
		<h1 class="text-2xl font-medium tracking-wide">Register</h1>
		<p class="text-sm text-muted-foreground">Fill the fields to register</p>
	</div>

	<form method="POST" action="?/registerEvent" use:enhance class="mt-5 flex flex-col gap-2">
		<Form.Field {form} name="username">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Username</Form.Label>
					<Input {...props} bind:value={$formData.username} placeholder="Enter your username" />
				{/snippet}
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} bind:value={$formData.email} placeholder="Enter your email" />
				{/snippet}
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<Input
						type="password"
						{...props}
						bind:value={$formData.password}
						placeholder="Enter your password"
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
						placeholder="Confirm your password"
					/>
				{/snippet}
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>

		<Form.Button disabled={$submitting || $delayed}>
			{#if $submitting || $delayed}
				Pls wait...
			{:else}
				Register
			{/if}
		</Form.Button>
	</form>
	<div class="">
		<p class="text-sm">
			Already have an account

			<a href={resolve('/login')} class="text-blue-500 underline">Login here</a>
		</p>
	</div>
</section>
