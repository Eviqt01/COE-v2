import { z } from 'zod';

const base = {
	email: z.email('Please enter a valid Email.'),
	password: z.string('Must enter a password').min(7, 'Must choose a strong password.').max(15)
};

export const loginschema = z.object(base);

export const registerschema = z
	.object(base)
	.extend({
		username: z
			.string('Please enter a nickname.')
			.max(10, 'Minimum character is 10')
			.min(5, 'Minimum character is 5.'),
		confirmPassword: z.string()
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (password !== confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords do not Match',
				path: ['confirmPassword']
			});
		}
	});

export const resetPasswordSchema = z
	.object({
		newPassword: z.string('Must enter a password').min(7, 'Must choose a strong password').max(15),
		confirmPassword: z.string('Please confirm your password')
	})
	.superRefine(({ newPassword, confirmPassword }, ctx) => {
		if (newPassword !== confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password do not Match',
				path: ['confirmPassword']
			});
		}
	});
export const forgotpasswordSchema = z.object(base).omit({ password: true });

export type LoginSchema = typeof loginschema;
export type RegisterSchema = typeof registerschema;
export type ForgotPasswordSchema = typeof forgotpasswordSchema;
export type ResetPasswordSchema = typeof resetPasswordSchema;
