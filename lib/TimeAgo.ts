export function getTimeAgo(dateString: string) {
  const now = new Date()
  const date = new Date(dateString)
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60) return "Online beberapa detik lalu"
  if (diff < 3600) return `Online ${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400) return `Online ${Math.floor(diff / 3600)} jam lalu`
  if (diff < 2592000) return `Online ${Math.floor(diff / 86400)} hari lalu`
  return `Online ${Math.floor(diff / 2592000)} bulan lalu`
}