<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Snippet } from 'svelte';
	import Phone from '@lucide/svelte/icons/phone';

	import Send from '@lucide/svelte/icons/send';

	let { children }: { children?: Snippet } = $props();
</script>

<section id="contact" class="bg-muted/30 py-24">
	<div class="container mx-auto px-6">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-bold tracking-tight">Get in Touch</h2>
			<p class="mx-auto max-w-2xl text-muted-foreground">
				Have questions about enrollment or school activities? Reach out to us through any of our
				channels or send us a message directly.
			</p>
		</div>

		<div class="grid gap-12 lg:grid-cols-2">
			<div class="grid gap-6 sm:grid-cols-2">
				<a
					href="https://facebook.com/jayjay.baguinaon.eviota"
					target="_blank"
					class="group flex flex-col items-center rounded-2xl border bg-card p-8 text-center transition-all hover:border-primary hover:shadow-xl active:scale-95"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white"
					></div>
					<h3 class="mb-1 font-bold">Facebook</h3>
					<p class="text-sm text-muted-foreground">jayjay baguinaon eviota</p>
				</a>

				<a
					href="https://instagram.com/evivszombies"
					target="_blank"
					class="group flex flex-col items-center rounded-2xl border bg-card p-8 text-center transition-all hover:border-primary hover:shadow-xl active:scale-95"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600 transition-colors group-hover:bg-pink-600 group-hover:text-white"
					></div>
					<h3 class="mb-1 font-bold">Instagram</h3>
					<p class="text-sm text-muted-foreground">@evivszombies</p>
				</a>

				<a
					href="https://twitter.com/evivszombies"
					target="_blank"
					class="group flex flex-col items-center rounded-2xl border bg-card p-8 text-center transition-all hover:border-primary hover:shadow-xl active:scale-95"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-900 transition-colors group-hover:bg-slate-900 group-hover:text-white"
					></div>
					<h3 class="mb-1 font-bold">X (Twitter)</h3>
					<p class="text-sm text-muted-foreground">@evivszombies</p>
				</a>

				<div
					class="group flex flex-col items-center rounded-2xl border bg-card p-8 text-center transition-all hover:border-primary hover:shadow-xl"
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

			<div class="rounded-3xl border bg-card p-8 shadow-sm md:p-12">
				<form class="grid gap-6">
					<div class="grid gap-2">
						<Label for="name">Full Name</Label>
						<Input id="name" placeholder="Your name" class="rounded-xl border-muted bg-muted/50" />
					</div>
					<div class="grid gap-2">
						<Label for="email">Email Address</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							class="rounded-xl border-muted bg-muted/50"
						/>
					</div>
					<div class="grid gap-2">
						<Label for="message">Message</Label>
						<textarea
							id="message"
							rows="4"
							placeholder="How can we help you?"
							class="flex w-full rounded-xl border border-muted bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						></textarea>
					</div>
					<Button
						class="w-full rounded-xl py-6 text-lg font-semibold transition-all active:scale-95"
					>
						<Send class="mr-2 size-5" />
						Send Message
					</Button>
				</form>
			</div>
		</div>
	</div>
	{@render children?.()}
</section>
