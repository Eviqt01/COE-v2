<script lang="ts">
	import NavBar from './(nav-bar)/nav-bar.svelte';
	import Hero from './(nav-bar)/(components)/hero.svelte';
	import Contact from './(nav-bar)/(components)/(contact)/contact.svelte';
	import Help from './(nav-bar)/(components)/(help)/help.svelte';
</script>

<NavBar>
	<section>
		<Hero></Hero>
		<section id="contact">
			<Contact></Contact>
		</section>
		<section id="help">
			<Help></Help>
		</section>
	</section>
</NavBar>
