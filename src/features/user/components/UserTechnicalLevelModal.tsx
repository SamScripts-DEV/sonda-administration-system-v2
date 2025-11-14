"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { AlertCircle } from 'lucide-react'
import { TechnicalLevel, User } from "../types"

interface TechnicalLevelAssignmentModalProps {
  isOpen: boolean
  user: User | null
  onClose: () => void
  onAssign: (userId: string, technicalLevel: string) => void
  technicalLevels: TechnicalLevel[]
}

const TECHNICAL_LEVELS = ["N1", "N2", "N3", "N4"]

export function TechnicalLevelAssignmentModal({
  isOpen,
  user,
  onClose,
  onAssign,
  technicalLevels
}: TechnicalLevelAssignmentModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(user?.technicalLevel || null)

  const handleAssign = () => {
    if (user && selectedLevel) {
      onAssign(user.id, selectedLevel)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar Nivel Técnico</DialogTitle>
        </DialogHeader>

        {user && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Seleccionar Nivel Técnico</label>
              <div className="grid grid-cols-2 gap-2">
                {technicalLevels.map((level) => (
                  <Card
                    key={level.id}
                    className={`p-3 cursor-pointer transition-all ${
                      selectedLevel === level.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedLevel(level.id)}
                  >
                    <p className="font-semibold text-center">{level.name}</p>
                  </Card>
                ))}
              </div>
            </div>

            {user.technicalLevel && (
              <div className="p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Nivel actual</p>
                <Badge>{user.technicalLevel}</Badge>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleAssign} disabled={!selectedLevel}>
            Asignar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
