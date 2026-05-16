<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index';
	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';
	import { Mail, UserPlus, Loader2 } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	let open = $state(false);
	let loading = $state(false);
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" class="gap-2">
				<UserPlus class="size-4" />
				Invite User
			</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content side="right" class="sm:max-w-md">
		<Sheet.Header>
			<Sheet.Title>Invite New Administrator</Sheet.Title>
			<Sheet.Description>
				Send a registration invitation to a new team member. They will receive an email with a link
				to set up their account.
			</Sheet.Description>
		</Sheet.Header>

		<form
			method="POST"
			action="?/inviteUser"
			use:enhance={() => {
				loading = true;
				return ({ result }) => {
					loading = false;
					if (result.type === 'success') {
						toast.success((result.data?.msg as string) ?? 'Invitation sent!');
						open = false;
					} else if (result.type === 'failure') {
						toast.error((result.data?.msg as string) ?? 'Failed to send invitation');
					}
				};
			}}
			class="mt-6 space-y-6"
		>
			<div class="space-y-2">
				<Label for="email">Email Address</Label>
				<div class="relative">
					<Mail class="absolute top-3 left-3 size-4 text-muted-foreground" />
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="colleague@example.com"
						required
						class="pl-10"
					/>
				</div>
				<p class="text-xs text-muted-foreground">The invitation link will expire in 24 hours.</p>
			</div>

			<Sheet.Footer>
				<Button type="submit" class="w-full" disabled={loading}>
					{#if loading}
						<Loader2 class="mr-2 size-4 animate-spin" />
						Sending...
					{:else}
						Send Invitation
					{/if}
				</Button>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>
