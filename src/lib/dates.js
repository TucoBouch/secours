const full = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
const short = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export const formatDateTime = (d) => full.format(new Date(d))
export const formatShort = (d) => short.format(new Date(d))

// « il y a 3 jours », « il y a 5 semaines »…
export function ago(d) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000)
  if (days < 1) return 'aujourd’hui'
  if (days === 1) return 'hier'
  if (days < 14) return `il y a ${days} jours`
  if (days < 60) return `il y a ${Math.floor(days / 7)} semaines`
  return `il y a ${Math.floor(days / 30)} mois`
}
