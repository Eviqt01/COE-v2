import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { completeProfileSchema } from './schema';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	
	if (!user) {
		throw redirect(303, '/login');
	}

	// If already has username, redirect to admin
	const metadata = user.user_metadata;
	if (metadata?.username) {
		throw redirect(303, '/admin');
	}

	return {
		form: await superValidate(zod4(completeProfileSchema)),
		email: user.email
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(completeProfileSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error } = await locals.supabase.auth.updateUser({
			password: form.data.password,
			data: {
				username: form.data.username
			}
		});

		if (error) {
			return fail(400, { form, msg: error.message });
		}

		throw redirect(303, '/admin');
	}
};
