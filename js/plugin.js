eagle.onPluginCreate((plugin) => {
	console.log('eagle.onPluginCreate');
});

eagle.onPluginRun(async () => {
	console.log('eagle.onPluginRun');
});

eagle.onPluginShow(() => {
	console.log('eagle.onPluginShow');
});

eagle.onPluginHide(() => {
	console.log('eagle.onPluginHide');
});

const getAuthorTagGroupId = async (tagGroupName) => {
	const tagGroups = await eagle.tagGroup.get();
	const ret = tagGroups.find(g => g.name === tagGroupName);
	return ret?.id ?? null;
}

const createAuthorTagMap = async (items, authorTagGroupId, statusView) => {
	let authorTagMap = {};

	for (const [index, item] of Object.entries(items)) {
		statusView.textContent = `Scanning items... (${parseInt(index) + 1} / ${items.length})`;
		for (tagName of item.tags) {
			const tags = await eagle.tag.get();
			const tag = tags.find(t => t.name === tagName);
			if (tag && tag.groups.includes(authorTagGroupId)) {
				const id = item.url.match(/^https?:\/\/(x|twitter)\.com\/(?<id>\w+)\/status\/\d+/)?.groups.id;
				if (id) {
					authorTagMap[id] = tag.name;
				}
			}
		}
	}
	return authorTagMap;
}

const autoTagAuthor = async (items, authorTagMap, statusView) => {
	let count = 0;
	for (item of items) {
		const id = item.url.match(/^https?:\/\/(x|twitter)\.com\/(?<id>\w+)\/status\/\d+/)?.groups.id;
		if (id && authorTagMap[id] && !item.tags.includes(authorTagMap[id])) {
			item.tags.push(authorTagMap[id]);
			await item.save();
			statusView.textContent = `Tagging item ID: ${item.id} with tag "${authorTagMap[id]}"`;
			count++;
		}
	}
	return count;
}

const notify = (message) => {
	const n = document.createElement('div');
	n.textContent = message;
	n.style.position = 'fixed';
	n.style.position = 'fixed';
	n.style.left = '50%';
	n.style.top = '6%';
	n.style.transform = 'translateX(-50%)';
	n.style.padding = '8px 14px';
	n.style.borderRadius = '10px';
	n.style.background = 'rgba(255,255,255,0.06)';
	n.style.color = 'white';
	n.style.backdropFilter = 'blur(6px)';
	n.style.fontSize = '13px';
	n.style.zIndex = '9999';
	document.body.appendChild(n);
	setTimeout(() => n.remove(), 1800);
}

const btn = document.getElementById('autotag');
btn.addEventListener('click', async () => {
	const statusView = document.getElementById('status');
	const tagGroupName = document.getElementById('authorInput');
	const authorTagGroupId = await getAuthorTagGroupId(tagGroupName.value);
	if (!authorTagGroupId) {
		notify(`TagGroup "${tagGroupName.value}" not found.`);
		return;
	}
	btn.setAttribute('disabled', '');
	btn.style.opacity = '0.9';
	const original = btn.innerHTML;
	btn.innerHTML = 'Processing...';

	const items = await eagle.item.getAll();
	const authorTagMap = await createAuthorTagMap(items, authorTagGroupId, statusView);

	const updatedItemsCount = await autoTagAuthor(items, authorTagMap, statusView);

	statusView.textContent = '';
	btn.innerHTML = original;
	btn.removeAttribute('disabled');
	// 簡易通知
	notify(`Tagged ${updatedItemsCount} items.`);
});