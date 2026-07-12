function ActionButton({ icon: Icon, label, variant = 'default', onClick }) {
  const base = 'btn btn-ghost btn-xs btn-square'
  const color = variant === 'danger'
    ? 'text-error hover:bg-error/10 hover:text-error'
    : 'hover:bg-base-content/10'

  return (
    <button
      className={`${base} ${color}`}
      onClick={onClick}
      title={label}
    >
      <Icon size={14} />
    </button>
  )
}

export default ActionButton
