import formData from "form-data";
import Mailgun from "mailgun.js";
import type { IMailgunClient } from "mailgun.js/Interfaces/MailgunClient";

const MAILGUN_USERNAME = "api";
const mailgun = new Mailgun(formData);
let cachedClient: IMailgunClient | undefined;

type RequiredEnv = "MAILGUN_API_KEY" | "MAILGUN_DOMAIN";

type SendEmailOptions = {
	to: string | string[];
	subject: string;
	text: string;
	html?: string;
	from?: string;
};

function getRequiredEnv(name: RequiredEnv): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing ${name} environment variable for Mailgun.`);
	}
	return value;
}

function getMailgunClient(): IMailgunClient {
	if (cachedClient) {
		return cachedClient;
	}

	const apiKey = getRequiredEnv("MAILGUN_API_KEY");
	const baseUrl = process.env.MAILGUN_API_BASE_URL;

	cachedClient = mailgun.client({
		username: MAILGUN_USERNAME,
		key: apiKey,
		...(baseUrl ? { url: baseUrl } : {}),
	});

	return cachedClient;
}

function resolveSender(
	providedFrom: string | undefined,
	domain: string,
): string {
	if (providedFrom) {
		return providedFrom;
	}

	const configuredFrom = process.env.MAILGUN_FROM_EMAIL;
	if (configuredFrom) {
		return configuredFrom;
	}

	return `Abul Khoyer <no-reply@${domain}>`;
}

export async function sendEmail({
	to,
	subject,
	text,
	html,
	from,
}: SendEmailOptions) {
	const domain = getRequiredEnv("MAILGUN_DOMAIN");
	const client = getMailgunClient();
	const recipients = Array.isArray(to) ? to : [to];

	await client.messages.create(domain, {
		to: recipients,
		from: resolveSender(from, domain),
		subject,
		text,
		html,
	});
}
