<script lang="ts">
	import Login from './(components)/(login)/login.svelte';
	import Register from './(components)/register/register.svelte';
	import ForgotPassword from './(components)/forgot-password/forgot-password.svelte';
	import ResetPassword from './(components)/reset-password/reset-password.svelte';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';

	const { data } = $props();

	const whatParams = $derived(page.url.searchParams.get('q'));
</script>

<main
	class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50/50 dark:bg-slate-950"
>
	<!-- Background blobs for "premium" feel -->
	<div class="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
	<div class="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>

	<div class="z-10 w-full max-w-md px-4">
		{#if whatParams === 'register'}
			<div in:fade={{ duration: 200 }}>
				<Register registerForm={data.registerForm} />
			</div>
		{:else if whatParams === 'forgot-password'}
			<div in:fade={{ duration: 200 }}>
				<ForgotPassword forgotpasswordForm={data.forgotpasswordForm} />
			</div>
		{:else if whatParams === 'reset-password'}
			<div in:fade={{ duration: 200 }}>
				<ResetPassword resetPasswordForm={data.resetPasswordForm} />
			</div>
		{:else}
			<div in:fade={{ duration: 200 }}>
				<Login loginForm={data.loginForm} />
			</div>
		{/if}
	</div>
</main>
