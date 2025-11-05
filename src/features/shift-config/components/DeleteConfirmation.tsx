"use client"

import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  shiftTypeName: string
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, shiftTypeName }: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </div>
          <DialogDescription className="text-left pt-2">
            ¿Está seguro que desea eliminar el tipo de turno <span className="font-semibold">"{shiftTypeName}"</span>?
            <br />
            <br />
            Esta acción desactivará el tipo de turno y no podrá ser utilizado en nuevas asignaciones. Los registros
            históricos se mantendrán intactos.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Sí, Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
