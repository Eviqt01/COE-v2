<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import Download from '@lucide/svelte/icons/download';
	import Printer from '@lucide/svelte/icons/printer';
	import { parseDate } from 'chrono-node';
	import { CalendarDate, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { untrack } from 'svelte';
	import { PDFDocument, StandardFonts } from 'pdf-lib';

	const getOrdinalSuffix = (n: number): string => {
		const mod100 = n % 100;
		if (mod100 >= 11 && mod100 <= 13) return 'th';
		switch (n % 10) {
			case 1:
				return 'st';
			case 2:
				return 'nd';
			case 3:
				return 'rd';
			default:
				return 'th';
		}
	};
	const formatDateInput = (date: DateValue | undefined) => {
		if (!date) return '';
		return date.toDate(getLocalTimeZone()).toLocaleDateString('en-US', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
	};

	const formatCertDate = (date: DateValue | undefined) => {
		if (!date) return { day: '', suffix: '', month: '', year: '', full: '' };
		const d = date.toDate(getLocalTimeZone());
		const day = d.getDate();
		return {
			day: String(day),
			suffix: getOrdinalSuffix(day),
			month: d.toLocaleDateString('en-US', { month: 'long' }),
			year: String(d.getFullYear()),
			full: formatDateInput(date)
		};
	};

	const id = $props.id();

	let open = $state(false);
	let inputValue = $state('');
	let value = $state<DateValue | undefined>(
		untrack(() => {
			const date = parseDate(inputValue);
			if (date) return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
			return undefined;
		})
	);

	let lrn = $state('');
	let fullName = $state('');
	let gradeSection = $state('');
	let schoolYear = $state('');

	let generating = $state(false);
	let pdfUrl = $state<string | null>(null);
	let errorMsg = $state('');

	const certDate = $derived(formatCertDate(value));

	const isFormValid = $derived(
		fullName.trim() !== '' &&
			gradeSection.trim() !== '' &&
			schoolYear.trim() !== '' &&
			value !== undefined
	);

	const getLrnNameText = (): string => {
		if (lrn.trim()) return `${lrn}   ${fullName}`;
		return fullName;
	};

	const generatePdfBytes = async (): Promise<Uint8Array> => {
		errorMsg = '';
		const templateBytes = await fetch('/Certificate_Of_Enrollment.pdf').then((r) => {
			if (!r.ok) throw new Error(`Failed to load template: ${r.status}`);
			return r.arrayBuffer();
		});

		const pdfDoc = await PDFDocument.load(templateBytes);
		const form = pdfDoc.getForm();
		const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

		const setField = (name: string, val: string): void => {
			try {
				const field = form.getTextField(name);
				field.setText(val);
				field.updateAppearances(font);
			} catch (e) {
				console.error(`Failed to fill field "${name}":`, e);
			}
		};

		setField('LRN_Name', getLrnNameText());
		setField('Grade_Section', gradeSection);
		setField('School_Year', schoolYear);
		setField('Month_Today', certDate.month);
		setField('Year_Today', certDate.year);

		setField('Date_Today', certDate.day);

		try {
			const dayField = form.getTextField('Date_Today');
			const suffixField = form.getTextField('Super_Script');

			const dayWidget = dayField.acroField.getWidgets()[0];
			const dayRect = dayWidget.getRectangle();

			const dayWidth = font.widthOfTextAtSize(certDate.day || '0', 11);

			const xOffset = certDate.day.length === 2 ? -2 : 0;
			dayWidget.setRectangle({
				x: dayRect.x + xOffset,
				y: dayRect.y,
				width: dayRect.width,
				height: dayRect.height
			});

			const suffixWidget = suffixField.acroField.getWidgets()[0];
			suffixWidget.setRectangle({
				x: dayRect.x + dayWidth + xOffset + 3,
				y: 360,
				width: 19.54,
				height: 9.61
			});

			suffixField.setText(certDate.suffix);
			suffixField.setFontSize(8);
			suffixField.updateAppearances(font);

			const monthField = form.getTextField('Month_Today');
			const monthWidget = monthField.acroField.getWidgets()[0];
			const monthRect = monthWidget.getRectangle();

			const longestMonthWidth = font.widthOfTextAtSize('September', 11);
			const monthWidth = font.widthOfTextAtSize(certDate.month, 11);

			const newOffset =
				monthWidth < longestMonthWidth - 2 ? (longestMonthWidth - monthWidth) / 2 : 0;

			monthWidget.setRectangle({
				x: monthRect.x + newOffset,
				y: monthRect.y,
				width: monthRect.width,
				height: monthRect.height
			});
		} catch (e) {
			console.error('Failed to position superscript:', e);
			setField('Super_Script', certDate.suffix);
		}

		form.flatten();

		const saved = await pdfDoc.save();
		return new Uint8Array(saved);
	};

	const updatePreview = async (): Promise<void> => {
		if (!isFormValid) {
			if (pdfUrl) {
				URL.revokeObjectURL(pdfUrl);
				pdfUrl = null;
			}
			return;
		}
		try {
			const bytes = await generatePdfBytes();
			const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
			if (pdfUrl) URL.revokeObjectURL(pdfUrl);
			pdfUrl = URL.createObjectURL(blob);
		} catch (err: unknown) {
			console.error('Preview failed:', err);
			errorMsg = err instanceof Error ? err.message : 'Failed to generate preview';
		}
	};

	const handleDownload = async (): Promise<void> => {
		generating = true;
		try {
			const bytes = await generatePdfBytes();
			const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `Certificate_of_Enrollment_${lrn || fullName.replace(/\s+/g, '_')}.pdf`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			setTimeout(() => URL.revokeObjectURL(url), 1000);
		} catch (err: unknown) {
			console.error('Download failed:', err);
			errorMsg = err instanceof Error ? err.message : 'Failed to generate PDF';
		} finally {
			generating = false;
		}
	};

	const handlePrint = async (): Promise<void> => {
		generating = true;
		try {
			const bytes = await generatePdfBytes();
			const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
			const url = URL.createObjectURL(blob);
			const printWindow = window.open(url, '_blank');
			if (printWindow) {
				printWindow.addEventListener('load', () => printWindow.print());
			}
			setTimeout(() => URL.revokeObjectURL(url), 60000);
		} catch (err: unknown) {
			console.error('Print failed:', err);
			errorMsg = err instanceof Error ? err.message : 'Failed to generate PDF';
		} finally {
			generating = false;
		}
	};

	$effect(() => {
		const _snapshot = `${lrn}|${fullName}|${gradeSection}|${schoolYear}|${String(value)}`;
		void _snapshot;
		void updatePreview();
	});
</script>

<section>
	<div class="mb-4 w-full space-y-2 rounded-md border p-5">
		<h1 class="text-3xl font-bold tracking-tight">Certificate of Enrollment</h1>
		<p class="text-muted-foreground">Fill in the required fields to generate the certificate.</p>
	</div>
</section>
<section class="container mx-auto min-h-screen max-w-7xl p-6">
	{#if errorMsg}
		<div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
			<p class="font-medium">Error: {errorMsg}</p>
			<p class="mt-1 text-sm">Check browser console for details.</p>
		</div>
	{/if}

	<div class="grid gap-8 lg:grid-cols-12">
		<div class="space-y-6 lg:col-span-5 xl:col-span-4">
			<Card>
				<CardHeader>
					<CardTitle class="text-lg">Student Information</CardTitle>
					<CardDescription>Enter student details.</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="space-y-2">
						<Label for="StudentLRN">
							Student LRN <span class="text-muted-foreground">(optional)</span>
						</Label>
						<Input
							id="StudentLRN"
							type="text"
							inputmode="numeric"
							pattern="[0-9]*"
							max="12"
							bind:value={lrn}
							placeholder="123456789012"
						/>
						{#if lrn.length > 0 && lrn.length < 12}
							<p class="text-xs text-amber-600">
								{12 - lrn.length} more digit{lrn.length === 11 ? '' : 's'} needed (or leave empty)
							</p>
						{/if}
						<p class="text-xs text-muted-foreground">Leave blank if student has no LRN</p>
					</div>

					<Separator />

					<div class="space-y-2">
						<Label for="FullName">Full Name <span class="text-red-500">*</span></Label>
						<Input
							id="FullName"
							type="text"
							bind:value={fullName}
							placeholder="Full Name"
							required
						/>
					</div>

					<div class="space-y-2">
						<Label for="GradeSection">Grade & Section <span class="text-red-500">*</span></Label>
						<Input
							id="GradeSection"
							type="text"
							bind:value={gradeSection}
							placeholder="Grade & Section"
							required
						/>
					</div>

					<div class="space-y-2">
						<Label for="SchoolYear">School Year <span class="text-red-500">*</span></Label>
						<Input
							id="SchoolYear"
							type="text"
							bind:value={schoolYear}
							placeholder="20XX-20XX"
							required
						/>
					</div>

					<div class="space-y-2">
						<Label for="date">Issued Date <span class="text-red-500">*</span></Label>
						<div class="relative flex gap-2">
							<Input
								id="date"
								type="text"
								bind:value={
									() => inputValue,
									(v) => {
										inputValue = v;
										const date = parseDate(v);
										if (date) {
											value = new CalendarDate(
												date.getFullYear(),
												date.getMonth() + 1,
												date.getDate()
											);
										}
									}
								}
								placeholder="Issued Date"
								class="bg-background pr-10"
								onkeydown={(e) => {
									if (e.key === 'ArrowDown') {
										e.preventDefault();
										open = true;
									}
								}}
								required
							/>
							<Popover.Root bind:open>
								<Popover.Trigger id="{id}-date-picker">
									{#snippet child({ props })}
										<Button
											{...props}
											variant="ghost"
											size="icon"
											class="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
										>
											<CalendarIcon class="h-4 w-4" />
											<span class="sr-only">Select date</span>
										</Button>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content class="w-auto overflow-hidden p-0" align="end">
									<Calendar
										type="single"
										bind:value
										captionLayout="dropdown"
										onValueChange={(v) => {
											inputValue = formatDateInput(v);
											open = false;
										}}
									/>
								</Popover.Content>
							</Popover.Root>
						</div>
					</div>

					<div class="flex flex-col gap-3">
						<div class="flex gap-3">
							<Button
								class="flex-1 gap-2"
								onclick={handleDownload}
								disabled={!isFormValid || generating}
								size="lg"
							>
								<Download class="h-4 w-4" />
								{generating ? 'Generating PDF...' : 'Download Certificate'}
							</Button>
							<Button
								variant="outline"
								class="gap-2"
								onclick={handlePrint}
								disabled={!isFormValid || generating}
								size="lg"
							>
								<Printer class="h-4 w-4" />
								Print/Preview
							</Button>
						</div>
						{#if !isFormValid}
							<p class="text-center text-xs text-muted-foreground">
								Fill in all required fields (*) to enable download/print
							</p>
						{/if}
					</div>
				</CardContent>
			</Card>
		</div>

		<div class="lg:col-span-7 xl:col-span-8">
			<Card class="sticky top-6">
				<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
					<div>
						<CardTitle class="text-lg">Live Preview</CardTitle>
						<CardDescription>
							{pdfUrl ? 'Exact PDF output' : 'Fill all required fields to see preview'}
						</CardDescription>
					</div>
					<Badge variant={isFormValid ? 'default' : 'secondary'} class="hidden sm:inline-flex">
						{isFormValid ? 'Ready' : 'Incomplete'}
					</Badge>
				</CardHeader>
				<CardContent>
					<div class="relative overflow-hidden rounded-lg border bg-white shadow-sm">
						<div
							class="relative mx-auto w-full"
							style="aspect-ratio: 595.28/841.89; max-height: 80vh;"
						>
							{#if pdfUrl}
								<iframe
									src="{pdfUrl}#toolbar=0&navpanes=0&scrollbar=0"
									class="absolute inset-0 h-full w-full"
									title="Certificate Preview"
								></iframe>
							{:else}
								<iframe
									src="/Certificate_Of_Enrollment.pdf#toolbar=0&navpanes=0&scrollbar=0"
									class="absolute inset-0 h-full w-full opacity-30 grayscale"
									title="Certificate Template"
								></iframe>
								<div class="absolute inset-0 flex items-center justify-center">
									<div class="space-y-2 text-center">
										<div
											class="mx-auto h-12 w-12 rounded-full border-2 border-dashed border-muted-foreground/30"
										></div>
										<p class="text-sm font-medium text-muted-foreground">
											Fill all required fields to preview
										</p>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
</section>
