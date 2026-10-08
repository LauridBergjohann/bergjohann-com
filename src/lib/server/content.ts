import type { ContentBlock, ContentPage, ContentSection } from '$lib/api/content';
import type { HeroImageSection } from '$lib/components/sections/interface';
import { pathFor, type Locale } from '$lib/i18n/locale';
import { site } from '$lib/site';

type Text = Record<Locale, string>;
type Translatable<T> = T extends string
	? T | Text
	: T extends (infer Item)[]
		? Translatable<Item>[]
		: T extends object
			? { [Key in keyof T]: Translatable<T[Key]> }
			: T;
type PageSource = Translatable<Omit<ContentPage, 'locale' | 'slug' | 'slugs'>> & {
	slugs: Record<Locale, string>;
};
const t = (en: string, de: string): Text => ({ en, de });

// Structure, media and page identities are shared. Only text leaves are translated.
const address: Translatable<ContentBlock> = {
	type: 'address',
	name: 'Laurid Bergjohann',
	lines: ['Geschwister-Scholl-Straße 6', '42897 Remscheid', t('Germany', 'Deutschland')]
};
const contact: Translatable<ContentBlock> = {
	type: 'contact',
	label: t('Email:', 'E-Mail:'),
	email: 'info@bergjohann.com'
};
const paragraph = (
	en: string,
	de: string,
	variant?: 'default' | 'lead' | 'muted'
): Translatable<ContentBlock> => ({
	type: 'paragraph',
	text: t(en, de),
	...(variant ? { variant } : {})
});

function hero(
	id: string,
	headline: Text,
	introduction: Text,
	eyebrow?: Text
): Translatable<HeroImageSection> {
	return {
		id: `${id}-hero`,
		layout: 'full',
		size: id === 'home' ? 'lg' : 'sm',
		headline,
		introduction,
		...(eyebrow ? { eyebrow } : {}),
		textBackground: false,
		image: {
			src: `/images/heroes/${id}-light.png`,
			srcDark: `/images/heroes/${id}.png`,
			alt: '',
			objectFit: 'contain'
		}
	};
}

function legalSection(
	id: string,
	title: Text,
	blocks: Translatable<ContentBlock>[]
): Translatable<ContentSection> {
	return {
		id,
		type: 'prose',
		title,
		variant: 'content',
		layout: 'inherit',
		spacing: 'none',
		divider: 'top',
		background: 'transparent',
		blocks
	};
}

const sources: PageSource[] = [
	{
		id: 'home',
		slugs: { en: '', de: '' },
		title: t(
			'Laurid Bergjohann – UX, Software Architecture & Model Making',
			'Laurid Bergjohann – UX, Softwarearchitektur & Modellbau'
		),
		description: t(
			'A personal workshop for user experience, user interfaces, software architecture, and model making.',
			'Eine persönliche Werkstatt für User Experience, Benutzeroberflächen, Softwarearchitektur und Modellbau.'
		),
		layout: 'landing',
		hero: hero(
			'home',
			t('Stay curious. Build things.', 'Bleib neugierig. Erschaffe Neues.'),
			t(
				'Exploring user experience, software architecture, and small worlds. A space for ideas, experiments, and things made by hand.',
				'User Experience, Softwarearchitektur und kleine Welten entdecken. Ein Ort für Ideen, Experimente und Dinge, die von Hand entstehen.'
			),
			t('Laurid Bergjohann |  UX · Architecture · Coding', 'Laurid Bergjohann | UX · Architektur · Coding')
		),
		actions: [
			{
				href: '/projects',
				label: t('Explore my projects', 'Entdecke meine Projekte'),
				primary: true
			},
			{ href: '/about', label: t('A little about me', 'Ein wenig über mich') }
		],
		sections: [
			{
				id: 'themen',
				type: 'topics',
				eyebrow: t('01 / Topics', '01 / Themen'),
				title: t('What I’m exploring.', 'Was mich beschäftigt.'),
				introduction: t(
					'The screen and the workbench have more in common than you might think.',
					'Bildschirm und Werkbank haben mehr gemeinsam, als man vielleicht denkt.'
				),
				variant: 'feature',
				layout: 'narrow',
				spacing: 'spacious',
				divider: 'none',
				items: [
					{
						id: 'ux',
						number: '01',
						title: t('User Experience & Interfaces', 'User Experience & Benutzeroberflächen'),
						text: t(
							'What makes digital products intuitive and enjoyable to use? Thoughts on interaction, design, and the details in between.',
							'Was macht digitale Produkte intuitiv und angenehm bedienbar? Gedanken zu Interaktion, Gestaltung und den Details dazwischen.'
						)
					},
					{
						id: 'architecture',
						number: '02',
						title: t('Software Architecture', 'Softwarearchitektur'),
						text: t(
							'Structures that work beyond the drawing board. Exploring frontends, platforms, and the reasoning behind technical decisions.',
							'Strukturen, die auch jenseits des Reißbretts funktionieren. Einblicke in Frontends, Plattformen und die Überlegungen hinter technischen Entscheidungen.'
						)
					},
					{
						id: 'model-making',
						number: '03',
						title: t('Model Making & Small Worlds', 'Modellbau & kleine Welten'),
						text: t(
							'Ships, helicopters, planes, trucks, and a Dutch town in H0 scale. Projects, repairs, and fresh ideas from the workshop.',
							'Schiffe, Hubschrauber, Flugzeuge, Lkw und eine niederländische Stadt im Maßstab H0. Projekte, Reparaturen und frische Ideen aus der Werkstatt.'
						)
					}
				]
			},
			{
				id: 'projekte',
				type: 'projects',
				eyebrow: t('02 / Projects', '02 / Projekte'),
				title: t('On my workbench.', 'Auf meiner Werkbank.'),
				introduction: t(
					'A first look at my projects. More detailed write-ups will follow over time.',
					'Ein erster Einblick in meine Projekte. Ausführliche Berichte folgen nach und nach.'
				),
				variant: 'feature',
				layout: 'narrow',
				spacing: 'spacious',
				divider: 'top',
				footer: t(
					'Project preview · Full write-up coming soon',
					'Projektvorschau · Ausführlicher Bericht folgt'
				),
				items: [
					{
						id: 'products-in-3d',
						category: 'WEB / THREE.JS',
						title: t('Exploring Products in 3D', 'Produkte in 3D entdecken'),
						text: t(
							'Experiments with interactive 3D product views and interfaces that make digital objects feel more tangible.',
							'Experimente mit interaktiven 3D-Produktansichten und Oberflächen, die digitale Objekte greifbarer machen.'
						)
					},
					{
						id: 'zeewijk',
						category: t('MODEL MAKING / H0', 'MODELLBAU / H0'),
						title: 'Zeewijk',
						text: t(
							'A fictional Dutch town growing piece by piece, with architecture, little stories, and close attention to detail.',
							'Eine fiktive niederländische Stadt, die Stück für Stück wächst – mit Architektur, kleinen Geschichten und viel Liebe zum Detail.'
						)
					}
				]
			},
			{
				id: 'ueber-mich',
				type: 'about',
				eyebrow: t('03 / About me', '03 / Über mich'),
				title: t('Hi, I’m Laurid.', 'Hallo, ich bin Laurid.'),
				variant: 'feature',
				layout: 'narrow',
				spacing: 'spacious',
				divider: 'top',
				paragraphs: [
					t(
						'I enjoy figuring out how things are put together and how to improve them. That applies just as much to an interface or a software architecture as it does to a model I build myself.',
						'Ich finde gerne heraus, wie Dinge aufgebaut sind und wie sie sich verbessern lassen. Das gilt für eine Benutzeroberfläche oder eine Softwarearchitektur genauso wie für ein Modell, das ich selbst baue.'
					),
					t(
						'This site is meant to be a personal space for ideas, experiences, and conversations, rather than a glossy portfolio. Over time, I hope it will grow into a blog and a journal of my projects.',
						'Diese Website soll ein persönlicher Ort für Ideen, Erfahrungen und Gespräche sein, kein Hochglanzportfolio. Mit der Zeit soll daraus ein Blog und ein Tagebuch meiner Projekte entstehen.'
					)
				],
				panel: {
					headline: t('Stay curious. Build things.', 'Bleib neugierig. Erschaffe Neues.'),
					text: t(
						'This website is built with SvelteKit, TypeScript and Tailwind.',
						'Diese Website entsteht mit SvelteKit, TypeScript und Tailwind.'
					),
					href: site.github,
					label: t('View the website repository', 'Zum Quellcode der Website')
				}
			}
		]
	},
	{
		id: 'blog',
		slugs: { en: 'blog', de: 'blog' },
		title: t('Blog', 'Blog'),
		description: t(
			'Ideas and experiences from my personal workshop.',
			'Ideen und Erfahrungen aus meiner persönlichen Werkstatt.'
		),
		layout: 'simple',
		hero: hero(
			'blog',
			t('Blog', 'Blog'),
			t('This blog is a work in progress.', 'Dieser Blog entsteht gerade.')
		),
		sections: []
	},
	{
		id: 'projects',
		slugs: { en: 'projects', de: 'projekte' },
		title: t('Projects', 'Projekte'),
		description: t(
			'Projects in software, user experience and model making.',
			'Projekte rund um Software, User Experience und Modellbau.'
		),
		layout: 'simple',
		hero: hero(
			'projects',
			t('Projects', 'Projekte'),
			t('This project section is a work in progress.', 'Dieser Projektbereich entsteht gerade.')
		),
		sections: []
	},
	{
		id: 'workbench',
		slugs: { en: 'workbench', de: 'werkbank' },
		title: t('Workbench', 'Werkbank'),
		description: t(
			'Experiments, repairs and ideas from the workbench.',
			'Experimente, Reparaturen und Ideen von der Werkbank.'
		),
		layout: 'simple',
		hero: hero(
			'workbench',
			t('Workbench', 'Werkbank'),
			t('This workbench section is a work in progress.', 'Dieser Werkbankbereich entsteht gerade.')
		),
		sections: []
	},
	{
		id: 'about',
		slugs: { en: 'about', de: 'ueber-mich' },
		title: t('About', 'Über mich'),
		description: t(
			'A little about Laurid Bergjohann and this personal workshop.',
			'Ein wenig über Laurid Bergjohann und diese persönliche Werkstatt.'
		),
		layout: 'simple',
		hero: hero(
			'about',
			t('About', 'Über mich'),
			t('This section about me is a work in progress.', 'Dieser Bereich über mich entsteht gerade.')
		),
		sections: []
	},
	{
		id: 'privacy',
		slugs: { en: 'privacy', de: 'datenschutz' },
		title: t('Privacy Policy', 'Datenschutzerklärung'),
		description: t(
			'Information about how personal data is processed when you visit bergjohann.com.',
			'Informationen zur Verarbeitung personenbezogener Daten beim Besuch von bergjohann.com.'
		),
		layout: 'legal',
		hero: hero(
			'privacy',
			t('Privacy Policy', 'Datenschutzerklärung'),
			t(
				'This privacy policy explains how personal data is processed when you visit bergjohann.com.',
				'Diese Datenschutzerklärung erläutert, wie personenbezogene Daten verarbeitet werden, wenn du bergjohann.com besuchst.'
			),
			t('Legal information', 'Rechtliche Informationen')
		),
		sections: [
			legalSection('privacy-controller', t('1. Controller', '1. Verantwortlicher'), [
				address,
				contact
			]),
			legalSection('privacy-hosting', t('2. Hosting', '2. Hosting'), [
				paragraph('This website is hosted by Vercel.', 'Diese Website wird bei Vercel gehostet.'),
				paragraph(
					'When you access this website, technical information may be processed that is required to deliver the website securely and reliably. This may include, in particular, your IP address, browser and device information, the requested URL, date and time of the request, and technical log and diagnostic data.',
					'Beim Aufruf dieser Website können technische Informationen verarbeitet werden, die für die sichere und zuverlässige Bereitstellung der Website erforderlich sind. Dazu können insbesondere deine IP-Adresse, Browser- und Geräteinformationen, die aufgerufene URL, Datum und Uhrzeit der Anfrage sowie technische Protokoll- und Diagnosedaten gehören.'
				),
				paragraph(
					'This processing is carried out for the purpose of providing, securing and maintaining the website. Where applicable, the legal basis is Article 6(1)(f) GDPR. The legitimate interest lies in the secure, reliable and efficient operation of this website.',
					'Diese Verarbeitung dient der Bereitstellung, Absicherung und Wartung der Website. Soweit einschlägig, ist die Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt im sicheren, zuverlässigen und effizienten Betrieb dieser Website.'
				),
				paragraph('The hosting provider is:', 'Der Hostinganbieter ist:'),
				paragraph(
					'Vercel Inc.\n340 S Lemon Ave #4133\nWalnut, CA 91789\nUnited States',
					'Vercel Inc.\n340 S Lemon Ave #4133\nWalnut, CA 91789\nUSA'
				),
				paragraph(
					"Further information about data processing by Vercel can be found in Vercel's privacy documentation.",
					'Weitere Informationen zur Datenverarbeitung durch Vercel findest du in den Datenschutzhinweisen von Vercel.'
				)
			]),
			legalSection(
				'privacy-theme-preference',
				t('3. Theme and language preferences', '3. Darstellungs- und Spracheinstellungen'),
				[
					paragraph(
						'This website initially follows your system’s light or dark appearance. If you select a different theme, the choice is kept in session storage for the current browser session and synchronized between open tabs of this website. It is not saved as a permanent theme preference. Your explicit choice of German or English is saved in local storage so that it can be restored on future visits.',
						'Diese Website übernimmt zunächst die helle oder dunkle Darstellung deines Systems. Wählst du ein anderes Design, wird die Auswahl im Session Storage für die aktuelle Browsersitzung gespeichert und zwischen geöffneten Tabs dieser Website synchronisiert. Sie wird nicht als dauerhafte Darstellungspräferenz gespeichert. Deine ausdrückliche Auswahl von Deutsch oder Englisch wird im Local Storage gespeichert, damit sie bei späteren Besuchen wiederhergestellt werden kann.'
					),
					paragraph(
						'Without a saved language preference, the first preferred language of your browser determines the language: German for German language settings, English for all other settings.',
						'Ohne gespeicherte Sprachauswahl richtet sich die Sprache nach der ersten bevorzugten Sprache deines Browsers: Bei einer deutschen Spracheinstellung wird Deutsch verwendet, bei allen anderen Einstellungen Englisch.'
					),
					paragraph(
						'These locally saved preferences are not used for tracking, advertising or analytics and are not transmitted to me.',
						'Diese lokal gespeicherten Einstellungen werden nicht für Tracking, Werbung oder Analysen genutzt und nicht an mich übermittelt.'
					)
				]
			),
			legalSection('privacy-contact-by-email', t('4. Contact by email', '4. Kontakt per E-Mail'), [
				paragraph(
					'If you contact me by email, the information you provide will be processed for the purpose of handling your request and communicating with you.',
					'Wenn du mich per E-Mail kontaktierst, werden die von dir übermittelten Informationen zur Bearbeitung deiner Anfrage und zur Kommunikation mit dir verarbeitet.'
				),
				paragraph(
					'Depending on the nature of your request, the legal basis may be Article 6(1)(b) GDPR where the communication relates to contractual or pre-contractual matters, or Article 6(1)(f) GDPR for general enquiries.',
					'Je nach Art deiner Anfrage kann die Rechtsgrundlage Art. 6 Abs. 1 lit. b DSGVO sein, wenn sich die Kommunikation auf vertragliche oder vorvertragliche Angelegenheiten bezieht, oder Art. 6 Abs. 1 lit. f DSGVO bei allgemeinen Anfragen.'
				),
				paragraph(
					'The data will be deleted when it is no longer required for the purpose for which it was collected, unless statutory retention obligations require longer storage.',
					'Die Daten werden gelöscht, sobald sie für den Zweck ihrer Erhebung nicht mehr erforderlich sind, sofern gesetzliche Aufbewahrungspflichten keine längere Speicherung verlangen.'
				)
			]),
			legalSection(
				'privacy-cookies-and-tracking',
				t('5. Cookies and tracking', '5. Cookies und Tracking'),
				[
					paragraph(
						'This website currently does not use analytics, advertising or other tracking services.',
						'Diese Website verwendet derzeit keine Analyse-, Werbe- oder sonstigen Trackingdienste.'
					),
					paragraph(
						'No tracking or marketing cookies are currently used.',
						'Derzeit werden keine Tracking- oder Marketingcookies verwendet.'
					)
				]
			),
			legalSection('privacy-your-rights', t('6. Your rights', '6. Deine Rechte'), [
				paragraph(
					'Subject to the requirements of the GDPR, you have rights including the right of access, rectification, erasure, restriction of processing, objection to processing and data portability.',
					'Unter den Voraussetzungen der DSGVO hast du insbesondere das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch gegen die Verarbeitung und Datenübertragbarkeit.'
				),
				paragraph(
					'You also have the right to lodge a complaint with a competent data protection supervisory authority.',
					'Du hast außerdem das Recht, dich bei einer zuständigen Datenschutzaufsichtsbehörde zu beschweren.'
				)
			]),
			legalSection(
				'privacy-changes-to-this-privacy-policy',
				t('7. Changes to this privacy policy', '7. Änderungen dieser Datenschutzerklärung'),
				[
					paragraph(
						'This privacy policy may be updated if the website or the services used on it change.',
						'Diese Datenschutzerklärung kann aktualisiert werden, wenn sich die Website oder die auf ihr genutzten Dienste ändern.'
					),
					paragraph('Last updated: October 2026', 'Stand: Oktober 2026', 'muted')
				]
			)
		]
	},
	{
		id: 'imprint',
		slugs: { en: 'imprint', de: 'impressum' },
		title: t('Imprint', 'Impressum'),
		description: t(
			'Legal notice and contact information for bergjohann.com.',
			'Anbieterkennzeichnung und Kontaktinformationen für bergjohann.com.'
		),
		layout: 'legal',
		hero: hero(
			'imprint',
			t('Imprint', 'Impressum'),
			t(
				'Information pursuant to Section 5 of the German Digital Services Act (DDG) and Section 18 (1) of the German Interstate Media Treaty (MStV).',
				'Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 1 Medienstaatsvertrag (MStV).'
			),
			t('Legal information', 'Rechtliche Informationen')
		),
		introBlocks: [address],
		sections: [
			legalSection('imprint-contact', t('Contact', 'Kontakt'), [contact]),
			legalSection(
				'imprint-responsible-for-editorial-content',
				t('Responsible for editorial content', 'Verantwortlich für redaktionelle Inhalte'),
				[
					paragraph(
						'Responsible for editorial content pursuant to Section 18 (2) MStV:',
						'Verantwortlich für redaktionelle Inhalte gemäß § 18 Abs. 2 MStV:'
					),
					address
				]
			)
		]
	},
	{
		id: 'sections',
		slugs: { en: 'sections', de: 'sektionen' },
		title: t('Section examples', 'Beispiele für Seitenabschnitte'),
		description: t(
			'Examples of the content sections used on this website.',
			'Beispiele für die Inhaltsabschnitte dieser Website.'
		),
		layout: 'demo',
		hero: {
			id: 'my-hero-section',
			image: {
				src: '/images/rhein-light.webp',
				srcDark: '/images/rhein-dark.webp',
				alt: t('Hero image: a view of the Rhine', 'Titelbild: Blick auf den Rhein')
			},
			headline: t('Welcome to My Site', 'Willkommen auf meiner Website'),
			layout: 'full',
			size: 'sm'
		},
		sections: [
			{
				id: 'my-text-section',
				type: 'richText',
				body: t('Hello, World!', 'Hallo, Welt!'),
				background: 'muted'
			},
			{
				id: 'my-list-section',
				type: 'list',
				cardSize: 'md',
				cards: [
					{
						id: 'card-1',
						href: '/projects',
						title: t('Card 1', 'Karte 1'),
						subtitle: t('This is card 1', 'Das ist Karte 1'),
						image: '/images/heroes/projects-light.png',
						imageCover: true
					},
					{
						id: 'card-2',
						href: '/workbench',
						title: t('Card 2', 'Karte 2'),
						subtitle: t('This is card 2', 'Das ist Karte 2'),
						image: '/images/heroes/workbench-light.png',
						imageCover: false
					}
				]
			},
			{
				id: 'my-image-section',
				type: 'image',
				image: {
					src: '/images/rhein-light.webp',
					srcDark: '/images/rhein-dark.webp',
					alt: t('Image section: a view of the Rhine', 'Bildabschnitt: Blick auf den Rhein'),
					objectFit: 'cover',
					aspect: '16/9'
				},
				headline: t('Image Section Headline', 'Überschrift des Bildabschnitts'),
				description: t(
					'This is the description for the image section.',
					'Dies ist die Beschreibung des Bildabschnitts.'
				),
				imageSide: 'left'
			},
			{
				id: 'my-video-section',
				type: 'video',
				video: { provider: 'youtube', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
				headline: t('Video Section Headline', 'Überschrift des Videoabschnitts'),
				description: t(
					'This is the description for the video section.',
					'Dies ist die Beschreibung des Videoabschnitts.'
				),
				videoSide: 'right'
			}
		]
	}
];

function localized(value: unknown, locale: Locale, key?: string): unknown {
	if (Array.isArray(value)) return value.map((item) => localized(item, locale));
	if (value && typeof value === 'object') {
		const record = value as Record<string, unknown>;
		if (typeof record.en === 'string' && typeof record.de === 'string') return record[locale];
		return Object.fromEntries(
			Object.entries(record).map(([name, item]) => [name, localized(item, locale, name)])
		);
	}
	if (key === 'href' && typeof value === 'string' && value.startsWith('/')) {
		const target = sources.find((source) => `/${source.slugs.en}` === value);
		if (target) return pathFor(locale, target.slugs[locale]);
	}
	return value;
}

function localizePage(source: PageSource, locale: Locale): ContentPage {
	const { slugs, ...content } = source;
	return {
		...(localized(content, locale) as Omit<ContentPage, 'locale' | 'slug' | 'slugs'>),
		locale,
		slug: slugs[locale],
		slugs: { ...slugs }
	};
}

export function getPages(locale: Locale): ContentPage[] {
	return sources.map((source) => localizePage(source, locale));
}

export function getPage(locale: Locale, slug: string): ContentPage | undefined {
	const source = sources.find((page) => page.slugs[locale] === slug);
	return source ? localizePage(source, locale) : undefined;
}

export function findPageBySlug(slug: string): ContentPage | undefined {
	const source = sources.find((page) => page.slugs.en === slug || page.slugs.de === slug);
	return source ? localizePage(source, 'en') : undefined;
}
