<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import RizalLogo from '$lib/images/rizal_Icon.jpg';
	import LogIn from '@lucide/svelte/icons/log-in';
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<nav
	class="sticky top-0 z-50 flex items-center justify-between border-b bg-background/95 px-6 py-4 backdrop-blur-md transition-all duration-300"
>
	<div class="flex items-center gap-3">
		<div
			class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary shadow-lg ring-2 ring-primary/20"
		>
			<img src={RizalLogo} alt="Rizal Logo" class="h-full w-full object-cover" />
		</div>
		<div class="flex flex-col leading-tight">
			<span class="text-lg font-extrabold tracking-tight text-primary">Rizal High School</span>
			<span class="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">Since 1902</span>
		</div>
	</div>

	<ul class="hidden items-center gap-8 text-sm font-semibold md:flex">
		<li><a href={resolve('/')} class="transition-colors hover:text-primary">Home</a></li>
		<li><a href="#contact" class="transition-colors hover:text-primary">Contact</a></li>
		<li><a href="#help" class="transition-colors hover:text-primary">Help</a></li>
	</ul>

	<div class="flex items-center gap-4">
		<Button
			href={resolve('/login')}
			variant="default"
			class="rounded-full px-6 font-bold shadow-md transition-all hover:shadow-xl active:scale-95"
		>
			<LogIn class="mr-2 size-4" />
			Admin Login
		</Button>
	</div>
</nav>


<main>
	{@render children?.()}
</main>
