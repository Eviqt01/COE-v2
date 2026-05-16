import { z } from 'zod';

export const completeProfileSchema = z
	.object({
		username: z
			.string()
			.min(5, 'Username must be at least 5 characters.')
			.max(15, 'Username must be at most 15 characters.'),
		password: z.string().min(7, 'Password must be at least 7 characters.').max(15),
		confirmPassword: z.string()
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (password !== confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords do not match',
				path: ['confirmPassword']
			});
		}
	});

export type CompleteProfileSchema = typeof completeProfileSchema;
