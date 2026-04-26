import type { Actions, PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { loginschema, registerschema, forgotpasswordSchema, resetPasswordSchema } from './schema';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		loginForm: await superValidate(zod4(loginschema)),
		registerForm: await superValidate(zod4(registerschema)),
		forgotpasswordForm: await superValidate(zod4(forgotpasswordSchema)),
		resetPasswordForm: await superValidate(zod4(resetPasswordSchema))
	};
};

export const actions: Actions = {
	loginEvent: async ({ request, locals }) => {
		const credentialForm = await superValidate(request, zod4(loginschema));

		if (!credentialForm.valid) {
			return fail(400, { credentialForm, msg: 'Please enter a valid email and password.' });
		}

		const { error } = await locals.supabase.auth.signInWithPassword({
			email: credentialForm.data.email,
			password: credentialForm.data.password
		});

		if (error) {
			return fail(401, { credentialForm, msg: error.message });
		}

		return { credentialForm, msg: 'Welcome back.' };
	},

	registerEvent: async ({ request, locals }) => {
		const credentialForm = await superValidate(request, zod4(registerschema));

		if (!credentialForm.valid) {
			return fail(400, { credentialForm, msg: 'Please check the highlighted fields.' });
		}
		const { error } = await locals.supabase.auth.signUp({
			email: credentialForm.data.email,
			password: credentialForm.data.password,
			options: {
				data: {
					username: credentialForm.data.username
				}
			}
		});

		if (error) {
			return fail(401, { credentialForm, msg: error.message });
		}

		return { credentialForm, msg: 'Account created successfully' };
	},

	forgotpasswordEvent: async ({ request, locals }) => {
		const credentialForm = await superValidate(request, zod4(forgotpasswordSchema));

		if (!credentialForm.valid) {
			return fail(400, { credentialForm, msg: 'Please enter a valid email address.' });
		}

		const { error } = await locals.supabase.auth.resetPasswordForEmail(credentialForm.data.email, {
			redirectTo: 'http://localhost:5173/login?q=reset-password'
		});
		if (error) {
			return fail(401, { credentialForm, msg: error.message });
		}
		return { credentialForm, msg: 'Success' };
	},

	resetPasswordEvent: async ({ request, locals }) => {
		const credentialForm = await superValidate(request, zod4(resetPasswordSchema));

		if (!credentialForm.valid) {
			return fail(400, { credentialForm, msg: 'error' });
		}

		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return fail(401, {
				credentialForm,
				msg: 'Reset session expired. Request a new reset email.'
			});
		}

		const { error } = await locals.supabase.auth.updateUser({
			password: credentialForm.data.newPassword
		});

		if (error) {
			return fail(401, { credentialForm, msg: error.message });
		}
		return { credentialForm, msg: 'Password updated succesfully.' };
	}
};
