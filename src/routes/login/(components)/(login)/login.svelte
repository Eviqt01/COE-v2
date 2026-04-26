<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import type { LoginSchema } from '../../schema';
	import { loginschema } from '../../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';

	interface Props {
		loginForm: SuperValidated<Infer<LoginSchema>>;
	}

	const { loginForm }: Props = $props();

	// svelte-ignore state_referenced_locally
	const form = superForm(loginForm, {
		validators: zod4Client(loginschema),
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

<section class="w-full max-w-sm rounded-lg border p-2">
	<div class="">
		<h1 class="text-center text-2xl leading-normal font-medium tracking-wide">Log in</h1>
		<p class="text-center text-sm text-muted-foreground">Enter your email and password to login.</p>
	</div>

	<form method="POST" action="?/loginEvent" use:enhance class="mt-5 flex flex-col gap-2">
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

		<Form.Button disabled={$submitting || $delayed}>
			{#if $submitting || $delayed}
				Please wait...
			{:else}
				Login
			{/if}
		</Form.Button>
	</form>
	<a href={resolve('/login?q=forgot-password')} class="text-xs text-blue-500 hover:underline"
		>Forgot Password?</a
	>
	<div class="text-center">
		<p class="text-sm">
			Don't have an account yet?
			<a href={resolve('/login?q=register')} class="text-blue-500 underline">Register here</a>
		</p>
	</div>
</section>
