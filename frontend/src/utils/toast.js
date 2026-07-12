import { toast } from 'sonner'

export function toastSuccess(title, description) {
  toast.success(title, { description })
}

export function toastError(message) {
  toast.error(message)
}

export function toastApiError(res, fallback) {
  toast.error(res.msg || fallback)
}

export function toastNetworkError() {
  toast.error('Error de conexión', { description: 'No se pudo conectar con el servidor' })
}
