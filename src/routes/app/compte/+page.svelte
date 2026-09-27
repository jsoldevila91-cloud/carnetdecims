<script lang="ts">
	import { Button, Card, LanguageSwitcher, PageMeta } from '$lib/ui';
	import { m } from '$lib/paraglide/messages';
</script>

<PageMeta title={m.account_meta_title()} noindex />

<h1 class="x-wide title">{m.account_title()}</h1>

<div class="stack">
	<Card as="section" padding="md" aria-labelledby="account-local">
		<h2 id="account-local" class="x-wide">{m.account_local_title()}</h2>
		<p>{m.account_local_text()}</p>
		<div class="actions">
			<Button variant="outline" disabled>{m.account_create_soon()}</Button>
		</div>
	</Card>

	<Card as="section" padding="md" variant="flat" aria-labelledby="account-lang">
		<h2 id="account-lang" class="x-wide">{m.account_language_title()}</h2>
		<LanguageSwitcher variant="full" />
	</Card>

	<Card as="section" padding="md" variant="flat" aria-labelledby="account-theme">
		<h2 id="account-theme" class="x-wide">{m.account_theme_title()}</h2>
		<p>{m.account_theme_text()}</p>
	</Card>
</div>

<style>
	.title {
		margin-bottom: var(--sp-5);
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1;
	}

	.stack {
		display: grid;
		gap: var(--sp-5);
		max-width: 40rem;
	}

	h2 {
		margin-bottom: var(--sp-2);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
	}

	p {
		color: var(--c-ink-2);
	}

	.actions {
		margin-top: var(--sp-4);
	}
</style>
