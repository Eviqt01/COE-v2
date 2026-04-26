<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
</script>

<section>
	<h1>This is my Project</h1>
	<a href={resolve('/login' as Pathname)}>Click ME to Login</a>
</section>
