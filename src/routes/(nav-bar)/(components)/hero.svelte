<script lang="ts">
	import School from '@lucide/svelte/icons/school';
	import rizalSchool from '$lib/images/school.png';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	let { children }: { children?: Snippet } = $props();
</script>

<section id="home" class="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
	<div class="absolute inset-0 z-0">
		<img src={rizalSchool} alt="School Hero" class="h-full w-full object-cover" />
		<div class="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent"></div>
	</div>

	<div class="relative z-10 container mx-auto px-6">
		<div class="max-w-3xl text-white">
			<div
				class="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-semibold text-primary-foreground ring-1 ring-white/20 backdrop-blur-md"
				in:fly={{ y: -20, duration: 800, delay: 200 }}
			>
				<School class="size-4 text-accent" />
				<span class="text-[10px] tracking-wide uppercase sm:text-xs"
					>Excellence in Education Since 1902</span
				>
			</div>

			<h1
				class="mb-6 text-5xl font-black tracking-tight drop-shadow-2xl md:text-8xl"
				in:fly={{ x: -30, duration: 800, delay: 400 }}
			>
				<span
					class="mb-2 block font-sans text-3xl font-light tracking-[0.2em] text-gray-300 uppercase md:text-4xl"
					>Welcome to</span
				>
				<span class="font-serif text-accent italic drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
					>Rizal High</span
				>
				<span class="font-serif">School</span>
			</h1>

			<p
				class="mb-10 max-w-xl text-lg leading-relaxed font-medium text-gray-200 drop-shadow-lg md:text-xl"
				in:fly={{ y: 20, duration: 800, delay: 600 }}
			>
				Empowering students through innovative learning, character development, and academic
				excellence. Join us in shaping the leaders of tomorrow.
			</p>
		</div>
	</div>

	<div class="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
		<svg
			viewBox="0 0 1200 120"
			preserveAspectRatio="none"
			class="relative block h-[100px] w-full fill-background"
		>
			<path
				d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.47,105.15,114,101.4,172.16,92.83c58.21-8.57,114.3-19,172.16-24.84V56.44Z"
			></path>
		</svg>
	</div>
	{@render children?.()}
</section>
