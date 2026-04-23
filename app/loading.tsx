export default function Loading() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full"
        style={{ border: '2px solid #ddd0c0', borderTopColor: '#6b1f2b' }}
      />
    </div>
  )
}
