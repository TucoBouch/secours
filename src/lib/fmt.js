// Échappe le HTML puis transforme **gras** en <strong>. Les contenus sont les nôtres,
// mais on garde l'échappement pour rester sûr si la source de données évolue.
export function fmt(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

export function normalize(text = '') {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}
