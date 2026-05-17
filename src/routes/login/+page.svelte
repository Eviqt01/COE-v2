<script lang="ts">
	import Login from './(components)/(login)/login.svelte';
	import Register from './(components)/register/register.svelte';
	import ForgotPassword from './(components)/forgot-password/forgot-password.svelte';
	import ResetPassword from './(components)/reset-password/reset-password.svelte';
	import { page } from '$app/state';
	import { fade, fly } from 'svelte/transition';
	import RizalLogo from '$lib/images/rizal_Icon.jpg';

	const { data } = $props();

	const whatParams = $derived(page.url.searchParams.get('q'));
</script>

<main
	class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50/50 dark:bg-slate-950"
>
	<!-- Premium Background Effects -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="absolute top-[10%] left-[10%] h-[40%] w-[40%] animate-pulse rounded-full bg-primary/10 blur-[120px]"
		></div>
		<div
			class="absolute top-[60%] right-[5%] h-[35%] w-[35%] rounded-full bg-blue-500/10 blur-[100px]"
		></div>
		<div
			class="absolute bottom-[10%] left-[20%] h-[30%] w-[30%] rounded-full bg-indigo-500/10 blur-[80px]"
		></div>
	</div>

	<div class="z-10 w-full max-w-md px-4">
		<!-- Branding -->
		<div class="mb-8 flex flex-col items-center gap-3 text-center" in:fade={{ duration: 600 }}>
			<div
				class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
			>
				<img src={RizalLogo} alt="Rizal Logo" class="h-full w-full rounded-xl object-cover" />
			</div>
			<div>
				<h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
					Rizal High School
				</h1>
				<p class="text-sm font-medium text-muted-foreground">
					Certificate of Enrollment Management System
				</p>
			</div>
		</div>

		<div class="grid">
			{#if whatParams === 'register'}
				<div class="col-start-1 row-start-1" in:fly={{ y: 20, duration: 400 }} out:fade={{ duration: 200 }}>
					<Register registerForm={data.registerForm} />
				</div>
			{:else if whatParams === 'forgot-password'}
				<div class="col-start-1 row-start-1" in:fly={{ y: 20, duration: 400 }} out:fade={{ duration: 200 }}>
					<ForgotPassword forgotpasswordForm={data.forgotpasswordForm} />
				</div>
			{:else if whatParams === 'reset-password'}
				<div class="col-start-1 row-start-1" in:fly={{ y: 20, duration: 400 }} out:fade={{ duration: 200 }}>
					<ResetPassword resetPasswordForm={data.resetPasswordForm} />
				</div>
			{:else}
				<div class="col-start-1 row-start-1" in:fly={{ y: 20, duration: 400 }} out:fade={{ duration: 200 }}>
					<Login loginForm={data.loginForm} />
				</div>
			{/if}
		</div>
	</div>
</main>
