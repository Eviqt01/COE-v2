<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import * as Card from '$lib/components/ui/card/index';
	import { Button } from '$lib/components/ui/button/index';
	import type { LoginSchema } from '../../schema';
	import { loginschema } from '../../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { Mail, Lock, LogIn, Loader2, Sparkles } from '@lucide/svelte';

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

<Card.Root
	class="border-slate-200/60 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80"
>
	<Card.Header class="space-y-1 text-center">
		<Card.Title class="text-2xl font-bold tracking-tight">Welcome back</Card.Title>
		<Card.Description>Choose your preferred login method</Card.Description>
	</Card.Header>
	<Card.Content class="grid gap-4">
		<form method="POST" action="?/loginEvent" use:enhance class="grid gap-4">
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
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

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex items-center justify-between">
							<Form.Label>Password</Form.Label>
							<a
								href={resolve('/login?q=forgot-password')}
								class="text-xs font-medium text-primary hover:underline"
							>
								Forgot?
							</a>
						</div>
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

			<Button type="submit" class="w-full font-semibold" disabled={$submitting || $delayed}>
				{#if $submitting || $delayed}
					<Loader2 class="mr-2 size-4 animate-spin" />
					Logging in...
				{:else}
					<LogIn class="mr-2 size-4" />
					Login
				{/if}
			</Button>
		</form>
	</Card.Content>
	<Card.Footer
		class="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/50"
	>
		<p class="text-sm text-muted-foreground">
			Don't have an account yet?
			<a href={resolve('/login?q=register')} class="font-semibold text-primary hover:underline">
				Register here
			</a>
		</p>
	</Card.Footer>
</Card.Root>
