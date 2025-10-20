"use client"

import { useState } from "react"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Search, UserIcon, AlertCircle } from "lucide-react"
import type { User } from "../types"


interface UserSalarySelectorProps {
  users: User[]
  selectedUser: User | null
  onSelectUser: (user: User) => void
}

export function UserSalarySelector({ users, selectedUser, onSelectUser }: UserSalarySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const MAX_RESULTS = 10
  const shouldShowResults = searchTerm.length >= 2

  const filteredUsers = shouldShowResults
    ? users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const displayedUsers = filteredUsers.slice(0, MAX_RESULTS)
  const hasMoreResults = filteredUsers.length > MAX_RESULTS

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Seleccionar Usuario</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Busca y selecciona un usuario para ver su información salarial
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Escribe al menos 2 caracteres para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {selectedUser && !shouldShowResults && (
            <div className="p-4 rounded-lg border border-primary bg-accent/50">
              <p className="text-sm text-muted-foreground mb-2">Usuario seleccionado:</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedUser.imageUrl || "/placeholder.svg"}
                    alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                  />
                  <AvatarFallback>
                    {selectedUser.firstName[0]}
                    {selectedUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          )}

          {shouldShowResults && (
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {displayedUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No se encontraron usuarios</p>
                  <p className="text-xs mt-1">Intenta con otro término de búsqueda</p>
                </div>
              ) : (
                <>
                  {displayedUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSelectUser(user)
                        setSearchTerm("") // Clear search after selection
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover:border-primary hover:bg-accent/50 ${
                        selectedUser?.id === user.id ? "border-primary bg-accent/50" : "border-border"
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.imageUrl || "/placeholder.svg"}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback>
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      {selectedUser?.id === user.id && (
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </button>
                  ))}

                  {hasMoreResults && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <p>
                        Mostrando {MAX_RESULTS} de {filteredUsers.length} resultados. Refina tu búsqueda para ver más.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {!shouldShowResults && !selectedUser && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Comienza a escribir para buscar usuarios</p>
              <p className="text-xs mt-1">Escribe al menos 2 caracteres</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
