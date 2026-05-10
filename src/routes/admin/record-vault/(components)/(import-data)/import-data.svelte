<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { StudentsServiceTB, type Students } from '$lib/services/students';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import UploadIcon from '@lucide/svelte/icons/upload';

	const studentService = new StudentsServiceTB(page.data.supabase);

	let loading = $state(false);
	let fileInput: HTMLInputElement;

	const handleFileChange = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		loading = true;
		const reader = new FileReader();

		reader.onload = async (e) => {
			try {
				const content = e.target?.result as string;
				const students = parseCSV(content);

				if (students.length === 0) {
					toast.error('No valid data found in CSV.');
					loading = false;
					return;
				}

				const { error } = await studentService.bulkInsertStudents(students);

				if (error) {
					toast.error(error);
				} else {
					toast.success(`Successfully imported ${students.length} students.`);
					await invalidateAll();
				}
			} catch (err) {
				console.error(err);
				toast.error('Failed to parse CSV file.');
			} finally {
				loading = false;
				target.value = ''; // Reset input
			}
		};

		reader.readAsText(file);
	};

	const parseCSV = (csv: string): Omit<Students, 'id' | 'created_at'>[] => {
		const lines = csv.split(/\r?\n/);
		if (lines.length < 2) return [];

		// Robust CSV split that handles quoted values containing commas
		const splitCSV = (line: string) => {
			const result = [];
			let current = '';
			let inQuotes = false;
			for (let i = 0; i < line.length; i++) {
				const char = line[i];
				if (char === '"') {
					inQuotes = !inQuotes;
				} else if (char === ',' && !inQuotes) {
					result.push(current.trim());
					current = '';
				} else {
					current += char;
				}
			}
			result.push(current.trim());
			return result.map((v) => v.replace(/^"|"$/g, ''));
		};

		const headers = splitCSV(lines[0]).map((h) => h.trim().toLowerCase());
		const records: Omit<Students, 'id' | 'created_at'>[] = [];

		for (let i = 1; i < lines.length; i++) {
			const currentLine = splitCSV(lines[i]);
			if (currentLine.length < headers.length || currentLine.every((v) => v === '')) continue;

			const record: Record<string, string | undefined> = {};
			headers.forEach((header, index) => {
				// Map headers to DB fields
				const fieldMap: Record<string, string> = {
					lrn: 'lrn',
					'full name': 'full_name',
					fullname: 'full_name',
					gender: 'gender',
					'date of first': 'date_of_first',
					dateoffirst: 'date_of_first',
					'grade section': 'grade_section',
					gradesection: 'grade_section',
					'school year': 'school_year',
					schoolyear: 'school_year',
					adviser: 'adviser'
				};

				const dbField = fieldMap[header] || header;
				record[dbField] = currentLine[index];
			});
			records.push(record as Omit<Students, 'id' | 'created_at'>);
		}

		return records;
	};
</script>

<input type="file" accept=".csv" class="hidden" bind:this={fileInput} onchange={handleFileChange} />

<Button
	variant="outline"
	class="cursor-pointer"
	onclick={() => fileInput.click()}
	disabled={loading}
>
	<UploadIcon class="mr-2 size-4" />
	{loading ? 'Importing...' : 'Import Data'}
</Button>
