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

const getArtistTagGroup = async (tagGroupName) => {
	const tagGroups = await eagle.tagGroup.get();
	return tagGroups.find(g => g.name === tagGroupName) ?? null;
}

const createArtistTagMap = async (items, artistTagGroup, statusView) => {
	let artistTagMap = {};

	for (const [index, item] of Object.entries(items)) {
		statusView.textContent = `Scanning items... (${parseInt(index) + 1} / ${items.length})`;
		
		const a = item.tags.find(tagName => artistTagGroup.tags.find(artistTagName => artistTagName === tagName));
		const id = item.url.match(/^https?:\/\/(x|twitter)\.com\/(?<id>\w+)\/status\/\d+/)?.groups.id;
		if (a && id) {
			artistTagMap[id] = a;
		}
	}
	return artistTagMap;
}

const autoTagArtist = async (items, artistTagMap, statusView) => {
	let count = 0;
	for (item of items) {
		const id = item.url.match(/^https?:\/\/(x|twitter)\.com\/(?<id>\w+)\/status\/\d+/)?.groups.id;
		if (id && artistTagMap[id] && !item.tags.includes(artistTagMap[id])) {
			item.tags.push(artistTagMap[id]);
			// 謎のエラーが出るケースがある
			try {
				await item.save();
				statusView.textContent = `Tagging item ID: ${item.id} with tag "${artistTagMap[id]}"`;
				count++;
			} catch (error) {
				console.error(`Failed to save item ID: ${item.id}`, error);
			}
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
	const tagGroupName = document.getElementById('artistInput');
	const artistTagGroup = await getArtistTagGroup(tagGroupName.value);
	if (!artistTagGroup) {
		notify(`TagGroup "${tagGroupName.value}" not found.`);
		return;
	}
	btn.setAttribute('disabled', '');
	btn.style.opacity = '0.9';
	const original = btn.innerHTML;
	btn.innerHTML = 'Processing...';

	const items = await eagle.item.getAll();
	const artistTagMap = await createArtistTagMap(items, artistTagGroup, statusView);

	const updatedItemsCount = await autoTagArtist(items, artistTagMap, statusView);

	statusView.textContent = '';
	btn.innerHTML = original;
	btn.removeAttribute('disabled');
	// 簡易通知
	notify(`Tagged ${updatedItemsCount} items.`);
});