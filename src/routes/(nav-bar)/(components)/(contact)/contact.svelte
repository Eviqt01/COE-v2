<script lang="ts">
	import type { Snippet } from 'svelte';
	import Phone from '@lucide/svelte/icons/phone';
	import Facebook from '@tabler/icons-svelte/icons/brand-facebook';
	import Instagram from '@tabler/icons-svelte/icons/brand-instagram';
	import Twitter from '@tabler/icons-svelte/icons/brand-x';
	import { inview } from '$lib/actions/inview';
	let { children }: { children?: Snippet } = $props();
</script>

<section id="contact" class="bg-muted/30 py-24">
	<div class="container mx-auto px-6">
		<div class="mb-16 text-center scroll-fade-up" style="--stagger: 0;" use:inview>
			<h2 class="mb-4 text-4xl font-bold tracking-tight">Get in Touch</h2>
			<p class="mx-auto max-w-2xl text-muted-foreground">
				Have questions about enrollment or school activities? Reach out to us through any of our
				channels or send us a message directly.
			</p>
		</div>

		<div class="flex items-center justify-center">
			<div class="grid gap-6 sm:grid-cols-2">
				<a
					href="https://www.facebook.com/jayjay.eviota"
					target="_blank"
					class="scroll-scale-in group flex flex-col items-center rounded-2xl border bg-card p-8 text-center transition-all hover:border-primary hover:shadow-xl active:scale-95"
					style="--stagger: 1;"
					use:inview
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white"
					>
						<Facebook class="size-6" />
					</div>
					<h3 class="mb-1 font-bold">Facebook</h3>
					<p class="text-sm text-muted-foreground">Jayjay Baguinaon Eviota</p>
				</a>

				<a
					href="https://instagram.com/evivszombies"
					target="_blank"
					class="scroll-scale-in group flex flex-col items-center rounded-2xl border bg-card p-8 text-center transition-all hover:border-primary hover:shadow-xl active:scale-95"
					style="--stagger: 2;"
					use:inview
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600 transition-colors group-hover:bg-pink-600 group-hover:text-white"
					>
						<Instagram class="size-6" />
					</div>
					<h3 class="mb-1 font-bold">Instagram</h3>
					<p class="text-sm text-muted-foreground">@evivszombies</p>
				</a>

				<a
					href="https://x.com/EvivsZombies123"
					target="_blank"
					class="scroll-scale-in group flex flex-col items-center rounded-2xl border bg-card p-8 text-center transition-all hover:border-primary hover:shadow-xl active:scale-95"
					style="--stagger: 3;"
					use:inview
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-900 transition-colors group-hover:bg-slate-900 group-hover:text-white"
					>
						<Twitter class="size-6" />
					</div>
					<h3 class="mb-1 font-bold">X (Twitter)</h3>
					<p class="text-sm text-muted-foreground">EvivsZombies123</p>
				</a>

				<div
					class="scroll-scale-in group flex flex-col items-center rounded-2xl border bg-card p-8 text-center transition-all hover:border-primary hover:shadow-xl"
					style="--stagger: 4;"
					use:inview
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white"
					>
						<Phone class="size-6" />
					</div>
					<h3 class="mb-1 font-bold">Mobile No.</h3>
					<p class="text-sm text-muted-foreground">09499080731</p>
				</div>
			</div>
		</div>
	</div>
	{@render children?.()}
</section>

