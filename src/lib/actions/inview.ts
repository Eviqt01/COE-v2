/**
 * Svelte action that adds/removes an 'in-view' class when the element enters/exits the viewport.
 * Usage: <div use:inview>
 * Combine with CSS: .in-view { ... }
 */
export function inview(node: HTMLElement, options?: { threshold?: number; once?: boolean }) {
	const { threshold = 0.15, once = true } = options ?? {};

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('in-view');
					if (once) observer.unobserve(node);
				} else if (!once) {
					node.classList.remove('in-view');
				}
			}
		},
		{ threshold }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
