const STATUS_COLORS = {
  info:    'badge-info',
  success: 'badge-success',
  warning: 'badge-warning',
  error:   'badge-error',
  primary: 'badge-primary',
  neutral: 'badge-neutral',
  accent:  'badge-accent',
  ghost:   'badge-ghost',
}

function StatusBadge({ color = 'neutral', label, size = 'text-xs' }) {
  const colorClass = STATUS_COLORS[color] || STATUS_COLORS.neutral

  return (
    <span className={`badge badge-soft ${colorClass} ${size}`}>
      {label}
    </span>
  )
}

export const ORDER_STATUS_BADGES = {
  active:    { label: 'Activo',     color: 'info' },
  confirmed: { label: 'Confirmado', color: 'warning' },
  paid:      { label: 'Pagado',     color: 'success' },
  cancelled: { label: 'Cancelado',  color: 'error' },
}

export const TABLE_STATUS_BADGES = {
  free:           { label: 'Disponible',    color: 'success' },
  occupied:       { label: 'Ocupada',       color: 'error' },
  pendingPayment: { label: 'Pendiente pago', color: 'warning' },
}

export const USER_ROLE_BADGES = {
  admin:  { label: 'Admin',  color: 'warning' },
  waiter: { label: 'Mesero', color: 'neutral' },
}

export const CUSTOMER_LEVEL_BADGES = {
  bronze: { label: 'Bronce', color: 'warning' },
  silver: { label: 'Plata',  color: 'neutral' },
  gold:   { label: 'Oro',    color: 'accent' },
}

export default StatusBadge
