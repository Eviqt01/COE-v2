<script lang="ts">
	import Login from './(components)/(login)/login.svelte';
	import Register from './(components)/register/register.svelte';
	import ForgotPassword from './(components)/forgot-password/forgot-password.svelte';
	import ResetPassword from './(components)/reset-password/reset-password.svelte';
	import { page } from '$app/state';

	const { data } = $props();

	const whatParams = $derived(page.url.searchParams.get('q'));
</script>

<main class="flex min-h-screen flex-col items-center justify-center">
	{#if whatParams === 'register'}
		<Register registerForm={data.registerForm} />
	{:else if whatParams === 'forgot-password'}
		<ForgotPassword forgotpasswordForm={data.forgotpasswordForm} />
	{:else if whatParams === 'reset-password'}
		<ResetPassword resetPasswordForm={data.resetPasswordForm} />
	{:else}
		<Login loginForm={data.loginForm} />
	{/if}
</main>
