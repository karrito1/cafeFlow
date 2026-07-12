function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-2xl bg-base-content/5 p-5 mb-5">
        <Icon size={40} className="text-base-content/30" />
      </div>
      <h3 className="text-lg font-semibold text-base-content">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-base-content/50 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export default EmptyState
