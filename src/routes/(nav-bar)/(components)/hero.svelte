<script lang="ts">
	import School from '@lucide/svelte/icons/school';
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<section id="home" class="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
	<div class="absolute inset-0 z-0">
		<img
			src="/Users/mikejohneviota/.gemini/antigravity/brain/47026d2f-102d-4887-9c1f-115dca60d2ba/school_hero_background_1778447865372.png"
			alt="School Hero"
			class="h-full w-full object-cover"
		/>
		<div class="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent"></div>
	</div>

	<div class="relative z-10 container mx-auto px-6">
		<div class="max-w-2xl text-white">
			<div
				class="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
			>
				<School class="size-4 text-primary" />
				<span>Excellence in Education Since 1902</span>
			</div>

			<h1 class="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
				Welcome to <span class="text-primary">Rizal High</span> School
			</h1>

			<p class="mb-10 text-lg leading-relaxed text-gray-200 md:text-xl">
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
