/// <reference types="mdast" />
import { h } from "hastscript";

const GITHUB_REPO_PATTERN = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/;

/**
 * Creates a GitHub Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.repo - The GitHub repository in the format "owner/repo".
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created GitHub Card component.
 */
export function GithubCardComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0)
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("github" directive must be leaf type "::github{repo="owner/repo"}")',
		]);

	// The repo name is interpolated into an inline <script>, so only allow
	// characters that GitHub permits in owner/repository names.
	if (!properties.repo || !GITHUB_REPO_PATTERN.test(properties.repo))
		return h(
			"div",
			{ class: "hidden" },
			'Invalid repository. ("repo" attribute must be in the format "owner/repo")',
		);

	const repo = properties.repo;
	const [owner, repoName] = repo.split("/");
	const cardUuid = `GC${Math.random().toString(36).slice(-6)}`; // Collisions are not important

	const nAvatar = h(`div#${cardUuid}-avatar`, { class: "gc-avatar" });
	const nLanguage = h(
		`span#${cardUuid}-language`,
		{ class: "gc-language" },
		"Waiting...",
	);

	const nTitle = h("div", { class: "gc-titlebar" }, [
		h("div", { class: "gc-titlebar-left" }, [
			h("div", { class: "gc-owner" }, [
				nAvatar,
				h("div", { class: "gc-user" }, owner),
			]),
			h("div", { class: "gc-divider" }, "/"),
			h("div", { class: "gc-repo" }, repoName),
		]),
		h("div", { class: "github-logo" }),
	]);

	const nDescription = h(
		`div#${cardUuid}-description`,
		{ class: "gc-description" },
		"Waiting for api.github.com...",
	);

	const nStars = h(`div#${cardUuid}-stars`, { class: "gc-stars" }, "00K");
	const nForks = h(`div#${cardUuid}-forks`, { class: "gc-forks" }, "0K");
	const nLicense = h(`div#${cardUuid}-license`, { class: "gc-license" }, "0K");

	const nScript = h(
		`script#${cardUuid}-script`,
		{ type: "text/javascript", defer: true },
		`
      fetch('https://api.github.com/repos/${repo}', { referrerPolicy: "no-referrer" }).then(response => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      }).then(data => {
        document.getElementById('${cardUuid}-description').innerText = data.description?.replace(/:[a-zA-Z0-9_]+:/g, '') || "Description not set";
        document.getElementById('${cardUuid}-language').innerText = data.language;
        document.getElementById('${cardUuid}-forks').innerText = Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.forks).replaceAll("\u202f", '');
        document.getElementById('${cardUuid}-stars').innerText = Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.stargazers_count).replaceAll("\u202f", '');
        const avatarEl = document.getElementById('${cardUuid}-avatar');
        avatarEl.style.backgroundImage = 'url(' + data.owner.avatar_url + ')';
        avatarEl.style.backgroundColor = 'transparent';
        document.getElementById('${cardUuid}-license').innerText = data.license?.spdx_id || "no-license";
        document.getElementById('${cardUuid}-card').classList.remove("fetch-waiting");
      }).catch(() => {
        const c = document.getElementById('${cardUuid}-card');
        c?.classList.add("fetch-error");
        console.warn("[GITHUB-CARD] (Error) Loading card for ${repo} | ${cardUuid}.")
      })
    `,
	);

	return h(
		`a#${cardUuid}-card`,
		{
			class: "card-github fetch-waiting no-styling",
			href: `https://github.com/${repo}`,
			target: "_blank",
			rel: "noopener noreferrer",
			repo,
		},
		[
			nTitle,
			nDescription,
			h("div", { class: "gc-infobar" }, [nStars, nForks, nLicense, nLanguage]),
			nScript,
		],
	);
}
