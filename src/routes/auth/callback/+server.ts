import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/admin';

	if (code) {
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error && data.user) {
			const metadata = data.user.user_metadata;
			// If metadata is missing, redirect to complete profile
			if (!metadata?.username) {
				throw redirect(303, '/auth/complete-profile');
			}
			throw redirect(303, `/${next.slice(1)}`);
		}
	}

	throw redirect(303, '/login?msg=auth-error');
};
