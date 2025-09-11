// src/utils/dateHelpers.js
export function formatDateLabel(dateObj) {
    const d = dateObj;
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'long' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
}

export function groupProductsByDateLabel(products = []) {
    // expects product.date or product.created_at - try several fields
    const getDate = (p) => {
        const possible = p.date || p.created_at || p.createdAt || p.timestamp;
        if (!possible) return null;
        const dt = new Date(possible);
        if (isNaN(dt)) return null;
        return dt;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const groups = {};
    for (const p of products) {
        const dt = getDate(p);
        let label = 'Unknown';
        if (!dt) {
            label = 'Unknown';
        } else {
            const check = new Date(dt);
            check.setHours(0, 0, 0, 0);
            if (check.getTime() === today.getTime()) label = 'Today';
            else if (check.getTime() === yesterday.getTime()) label = 'Yesterday';
            else label = formatDateLabel(check);
        }
        if (!groups[label]) groups[label] = [];
        groups[label].push(p);
    }

    // Keep groups in natural order: Today, Yesterday, then descending dates
    const orderedKeys = Object.keys(groups).sort((a, b) => {
        if (a === 'Today') return -1;
        if (b === 'Today') return 1;
        if (a === 'Yesterday') return -1;
        if (b === 'Yesterday') return 1;
        // parse "DD MMM YYYY"
        const toTs = (s) => {
            const d = new Date(s);
            return isNaN(d) ? 0 : d.getTime();
        };
        return toTs(b) - toTs(a);
    });

    const orderedObj = {};
    orderedKeys.forEach(k => orderedObj[k] = groups[k]);
    return orderedObj;
}
