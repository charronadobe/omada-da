export default function decorate(block) {
  const rows = [...block.children];
  const items = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const stat = document.createElement('div');
      stat.className = 'stats-bar-item';
      const value = cells[0];
      value.className = 'stats-bar-value';
      const desc = cells[1];
      desc.className = 'stats-bar-desc';
      stat.append(value, desc);
      items.push(stat);
    }
    row.remove();
  });

  const grid = document.createElement('div');
  grid.className = 'stats-bar-grid';
  items.forEach((it) => grid.append(it));
  block.append(grid);
}
