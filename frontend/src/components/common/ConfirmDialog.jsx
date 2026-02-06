import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="text-red-500" size={24} />
          </div>
          <p className="text-gray-700">{message}</p>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger flex-1"
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
