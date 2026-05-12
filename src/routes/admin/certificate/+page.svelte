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
	import DepedSeal from '$lib/images/depedSeal.png';
	import principalSignature from '$lib/images/principalSignature.png';
	import bagongPilipinas from '$lib/images/bagongPilipinas.png';
	import depEdLogo from '$lib/images/depEdLogo.png';
	import rizalLogo from '$lib/images/rizalLogo.png';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import Download from '@lucide/svelte/icons/download';
	import Printer from '@lucide/svelte/icons/printer';
	import { parseDate } from 'chrono-node';
	import { CalendarDate, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { untrack, onMount } from 'svelte';
	import { page } from '$app/state';
	import { StudentsServiceTB } from '$lib/services/students';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';

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

	const formatDateInput = (date: DateValue | undefined): string => {
		if (!date) return '';
		return date.toDate(getLocalTimeZone()).toLocaleDateString('en-US', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
	};

	const formatCertDate = (date: DateValue | undefined) => {
		if (!date) return { day: '', suffix: '', month: '', year: '' };
		const d = date.toDate(getLocalTimeZone());
		const day = d.getDate();
		return {
			day: String(day),
			suffix: getOrdinalSuffix(day),
			month: d.toLocaleDateString('en-US', { month: 'long' }),
			year: String(d.getFullYear())
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

	let lrn = $state(page.url.searchParams.get('lrn') ?? '');
	let fullName = $state(page.url.searchParams.get('fullName') ?? '');
	let gradeSection = $state(page.url.searchParams.get('gradeSection') ?? '');
	let schoolYear = $state(page.url.searchParams.get('schoolYear') ?? '');
	let studentId = $state(page.url.searchParams.get('id') ?? '');
	let generating = $state(false);
	let errorMsg = $state('');
	let librariesLoaded = $state(false);

	const studentServiceFAC = new StudentsServiceTB(page.data.supabase);

	const certDate = $derived(formatCertDate(value));
	const isFormValid = $derived(
		fullName.trim() !== '' &&
			gradeSection.trim() !== '' &&
			schoolYear.trim() !== '' &&
			value !== undefined
	);
	const getLrnNameText = (): string => (lrn.trim() ? `${lrn}   ${fullName}` : fullName);

	const loadScript = (src: string): Promise<void> =>
		new Promise((resolve, reject) => {
			const existing = document.querySelector(`script[src="${src}"]`);
			if (existing) {
				resolve();
				return;
			}
			const s = document.createElement('script');
			s.src = src;
			s.onload = () => resolve();
			s.onerror = () => reject(new Error(`Failed to load ${src}`));
			document.head.appendChild(s);
		});

	onMount(async () => {
		try {
			await loadScript('https://unpkg.com/html2canvas-pro@1.5.8/dist/html2canvas-pro.min.js');
			await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
			librariesLoaded = true;
		} catch {
			errorMsg = 'Failed to load PDF libraries. Please refresh and try again.';
		}
	});

	const hideOnError = (e: Event): void => {
		const img = e.currentTarget as HTMLImageElement;
		img.style.display = 'none';
	};

	const generatePdfBlob = async (): Promise<Blob> => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const w = window as any;
		const html2canvasFn = w.html2canvasPro ?? w.html2canvas_pro ?? w.html2canvas;
		if (!html2canvasFn) throw new Error('html2canvas-pro failed to load.');
		const { jsPDF } = w.jspdf;

		const source = document.getElementById('cert-preview-content');
		if (!source) throw new Error('Certificate preview element not found.');

		// Create an isolated wrapper at exact cert size off-screen
		const wrapper = document.createElement('div');
		wrapper.style.cssText = [
			'position:fixed',
			'left:-9999px',
			'top:0',
			'width:595px',
			'height:790px',
			'overflow:hidden',
			'background:#ffffff',
			'pointer-events:none',
			'z-index:-1'
		].join(';');

		// Deep clone the cert into the wrapper
		const clone = source.cloneNode(true) as HTMLElement;
		clone.style.transform = 'none';
		clone.style.position = 'relative';
		clone.style.left = '0';
		clone.style.top = '0';
		clone.style.width = '595px';
		clone.style.height = '790px';

		wrapper.appendChild(clone);
		document.body.appendChild(wrapper);

		// Let browser paint the clone
		await new Promise((r) => requestAnimationFrame(r));
		await new Promise((r) => requestAnimationFrame(r));

		let canvas: HTMLCanvasElement;
		try {
			canvas = await html2canvasFn(wrapper, {
				scale: 3,
				useCORS: true,
				allowTaint: false,
				foreignObjectRendering: false,
				letterRendering: false,
				width: 595,
				height: 790,
				windowWidth: 595,
				windowHeight: 790
			});
		} finally {
			document.body.removeChild(wrapper);
		}

		const imgData = canvas.toDataURL('image/jpeg', 1.0);
		const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
		pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89);
		return pdf.output('blob');
	};

	const handleDownload = async (): Promise<void> => {
		if (!librariesLoaded) {
			errorMsg = 'Libraries not ready, please try again.';
			return;
		}
		generating = true;
		errorMsg = '';
		try {
			const blob = await generatePdfBlob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `Certificate_of_Enrollment_${lrn || fullName.replace(/\s+/g, '_')}.pdf`;
			a.click();

			if (studentId) {
				const { data: student } = await studentServiceFAC.getStudentById(studentId);
				if (student) {
					const { error } = (await page.data.supabase?.from('dashboard').upsert({
						...student,
						lrn: lrn,
						full_name: fullName,
						grade_section: gradeSection,
						school_year: schoolYear,
						created_at: new Date().toISOString()
					})) ?? { error: new Error('Supabase client not initialized') };

					if (!error) {
						toast.success('Certificate downloaded and copied to dashboard.');
						goto(resolve('/admin'));
					} else {
						console.error('Failed to copy to dashboard:', error);
					}
				}
			}

			setTimeout(() => URL.revokeObjectURL(url), 60_000);
		} catch (err: unknown) {
			errorMsg = err instanceof Error ? err.message : 'Failed to generate PDF';
		} finally {
			generating = false;
		}
	};

	const handlePrint = async (): Promise<void> => {
		if (!librariesLoaded) {
			errorMsg = 'Libraries not ready, please try again.';
			return;
		}
		generating = true;
		errorMsg = '';
		try {
			const blob = await generatePdfBlob();
			const url = URL.createObjectURL(blob);
			const win = window.open(url, '_blank');
			if (win) win.addEventListener('load', () => win.print());

			if (studentId) {
				const { data: student } = await studentServiceFAC.getStudentById(studentId);
				if (student) {
					const { error } = (await page.data.supabase?.from('dashboard').upsert({
						...student,
						lrn: lrn,
						full_name: fullName,
						grade_section: gradeSection,
						school_year: schoolYear,
						created_at: new Date().toISOString()
					})) ?? { error: new Error('Supabase client not initialized') };

					if (!error) {
						toast.success('Certificate issued and copied to dashboard.');
						goto(resolve('/admin'));
					} else {
						console.error('Failed to copy to dashboard:', error);
					}
				}
			}

			setTimeout(() => URL.revokeObjectURL(url), 60_000);
		} catch (err: unknown) {
			errorMsg = err instanceof Error ? err.message : 'Failed to generate PDF';
		} finally {
			generating = false;
		}
	};

	let previewWrapper: HTMLDivElement | undefined = $state();
	let scale = $state(1);

	$effect(() => {
		if (!previewWrapper) return;
		const observer = new ResizeObserver(() => {
			scale = (previewWrapper?.offsetWidth ?? 595) / 595;
		});
		observer.observe(previewWrapper);
		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://cdnjs.cloudflare.com" />
	<link rel="preconnect" href="https://unpkg.com" />
</svelte:head>

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
								disabled={!isFormValid || generating || !librariesLoaded}
								size="lg"
							>
								<Download class="h-4 w-4" />
								{generating ? 'Generating PDF…' : 'Download Certificate'}
							</Button>
							<Button
								variant="outline"
								class="gap-2"
								onclick={handlePrint}
								disabled={!isFormValid || generating || !librariesLoaded}
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
						{#if !librariesLoaded}
							<p class="text-center text-xs text-amber-600">Loading PDF library…</p>
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
						<CardDescription>Mirrors the generated PDF output</CardDescription>
					</div>
					<Badge variant={isFormValid ? 'default' : 'secondary'} class="hidden sm:inline-flex">
						{isFormValid ? 'Ready' : 'Incomplete'}
					</Badge>
				</CardHeader>
				<CardContent>
					<div
						bind:this={previewWrapper}
						class="w-full overflow-hidden rounded-lg border bg-white shadow-sm"
					>
						<div style="height: {790 * scale}px; position: relative;">
							<div
								style="transform: scale({scale}); transform-origin: top left; width: 595px; position: absolute; top: 0; left: 0;"
							>
								<!-- ============================================================
								     CERTIFICATE CONTENT
								     ALL styles are inline — NO Tailwind classes used here.
								     This ensures html2canvas renders identically in production.
								     ============================================================ -->
								<div
									id="cert-preview-content"
									style="position:relative;overflow:hidden;background:#ffffff;color:#000000;width:595px;height:790px;font-family:'Times New Roman',Times,serif;box-sizing:border-box;"
								>
									<!-- HEADER -->
									<div style="padding:18px 48px 0 48px;text-align:center;">
										<img
											src={DepedSeal}
											alt="DepEd Seal"
											style="display:block;margin:0 auto 4px auto;width:60px;height:60px;object-fit:contain;"
											onerror={hideOnError}
										/>
										<p style="margin:0;line-height:1.3;font-weight:bold;font-size:9.5pt;">
											Republic of the Philippines
										</p>
										<p style="margin:0;line-height:1.2;font-weight:bold;font-size:15pt;">
											Department of Education
										</p>
										<p style="margin:0;line-height:1.3;font-weight:bold;font-size:9pt;">
											National Capital Region
										</p>
										<p style="margin:0;line-height:1.3;font-weight:bold;font-size:9pt;">
											Schools Division of Pasig City
										</p>
										<p style="margin:0;line-height:1.3;font-weight:bold;font-size:9pt;">
											RIZAL HIGH SCHOOL
										</p>
										<p style="margin:0;line-height:1.3;font-weight:bold;font-size:9pt;">
											CANIOGAN, PASIG CITY
										</p>
									</div>

									<!-- TITLE -->
									<div
										style="margin:4px 48px 10px 48px;border-top:1px solid #000000;padding:16px 0;text-align:center;"
									>
										<p style="margin:0;font-weight:bold;font-size:14pt;letter-spacing:1px;">
											<span style="border-bottom:1.5px solid #000000;padding-bottom:1px;">
												CERTIFICATE OF ENROLLMENT
											</span>
										</p>
									</div>

									<!-- BODY -->
									<div style="margin:0 54px;font-size:11pt;line-height:1.5;">
										<p style="margin:0 0 14px 0;text-align:justify;text-indent:36px;">
											This is to certify that the learner with the information listed below is
											officially enrolled at Rizal High School.
										</p>

										<table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
											<tbody>
												<tr>
													<td
														style="white-space:nowrap;padding-right:6px;padding-bottom:2px;vertical-align:bottom;font-weight:bold;width:1%;"
													>
														LRN &amp; NAME:
													</td>
													<td
														style="border-bottom:1px solid #000000;padding-bottom:2px;vertical-align:bottom;"
													>
														{getLrnNameText()}
													</td>
												</tr>
											</tbody>
										</table>

										<table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
											<tbody>
												<tr>
													<td
														style="white-space:nowrap;padding-right:6px;padding-bottom:2px;vertical-align:bottom;font-weight:bold;width:1%;"
													>
														GRADE &amp; SECTION:
													</td>
													<td style="padding-bottom:2px;vertical-align:bottom;">
														<span style="text-decoration:underline;">{gradeSection || ''}</span>
													</td>
												</tr>
											</tbody>
										</table>

										<table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
											<tbody>
												<tr>
													<td
														style="white-space:nowrap;padding-right:6px;padding-bottom:2px;vertical-align:bottom;font-weight:bold;width:1%;"
													>
														SCHOOL YEAR:
													</td>
													<td style="padding-bottom:2px;vertical-align:bottom;">
														<span style="text-decoration:underline;">{schoolYear || ''}</span>
													</td>
												</tr>
											</tbody>
										</table>

										<p style="margin:0;text-align:justify;text-indent:36px;">
											Issued this
											<span style="text-decoration:underline;">
												{certDate.day || ''}<sup style="font-size:7pt;text-decoration:underline;"
													>{certDate.suffix || ''}</sup
												>
												day of {certDate.month || ''}, {certDate.year || ''}
											</span>
											at Dr. Sixto Antonio Avenue, Caniogan, Pasig City, Metro Manila, Philippines.
										</p>
									</div>

									<!-- SIGNATURE -->
									<div
										style="position:absolute;bottom:180px;right:54px;width:210px;text-align:center;"
									>
										<img
											src={principalSignature}
											alt="Signature"
											style="display:block;margin:0 auto;height:95px;width:80px;"
											onerror={hideOnError}
										/>
										<p style="margin:-36px 0 0 0;font-weight:bold;font-size:10.5pt;">
											RICHARD T. SANTOS
										</p>
										<p style="margin:0;font-weight:bold;font-size:10.5pt;">Principal IV</p>
									</div>

									<!-- FOOTER -->
									<div
										style="position:absolute;bottom:20px;left:0;right:0;display:flex;justify-content:center;padding:0 32px 10px 32px;"
									>
										<div
											style="margin-top:6px;display:flex;align-items:center;gap:10px;border-top:1px solid #000000;width:490px;padding-top:6px;"
										>
											<img
												src={depEdLogo}
												alt="DepEd"
												style="width:52px;height:52px;object-fit:contain;flex-shrink:0;"
												onerror={hideOnError}
											/>
											<img
												src={bagongPilipinas}
												alt="Bagong Pilipinas"
												style="width:52px;height:52px;object-fit:contain;flex-shrink:0;"
												onerror={hideOnError}
											/>
											<img
												src={rizalLogo}
												alt="School Seal"
												style="width:52px;height:52px;object-fit:contain;flex-shrink:0;"
												onerror={hideOnError}
											/>
											<div
												style="margin-left:8px;font-family:'Times New Roman',Times,serif;font-size:9pt;line-height:1.6;"
											>
												<p style="margin:0;font-weight:bold;">
													Address: Dr. Sixto Ant. Ave., Caniogan, Pasig City
												</p>
												<p style="margin:0;font-weight:bold;">Tel: 8696-1251</p>
												<p style="margin:0;font-weight:bold;">
													Email: <span
														style="font-weight:bold;text-decoration:underline;color:#1a1aaa;"
														>305413@deped.gov.ph</span
													>
												</p>
												<p style="margin:0;font-weight:bold;font-style:italic;">
													"Strive for Excellence for the Glory of God"
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
</section>
