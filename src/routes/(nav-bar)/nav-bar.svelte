<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import LogIn from '@lucide/svelte/icons/log-in';
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<nav
	class="sticky top-0 z-50 flex items-center justify-between border-b bg-background/95 px-6 py-4 backdrop-blur transition-all duration-300"
>
	<div class="flex items-center gap-2">
		<div
			class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
		>
			<GraduationCap class="size-6" />
		</div>
		<span class="text-xl font-bold tracking-tight">Rizal High School</span>
	</div>

	<ul class="hidden items-center gap-8 text-sm font-medium md:flex">
		<li><a href={resolve('/')} class="transition-colors hover:text-primary">Home</a></li>
		<li><a href="#contact" class="transition-colors hover:text-primary">Contact</a></li>
		<li><a href="#help" class="transition-colors hover:text-primary">Help</a></li>
	</ul>

	<div class="flex items-center gap-4">
		<Button
			href={resolve('/login')}
			variant="default"
			class="rounded-full px-6 transition-all hover:shadow-lg active:scale-95"
		>
			<LogIn class="mr-2 size-4" />
			Admin Login
		</Button>
	</div>
</nav>

<main>
	{@render children?.()}
</main>
