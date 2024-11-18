'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/Components/ui/button"
import { PlusIcon, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/Components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/Components/ui/card"
import Modal from '@/Components/Modal'
import Swal from 'sweetalert2'
import UserForm from './UserForm'
import AppLayout from '@/Layouts/AppLayout'

const User = ({ users = [], rols = [], countries = [] }) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [usersData, setUsersData] = useState(users)
  const [selectedUser, setSelectedUser] = useState(null)

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users')
      setUsersData(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleEdit = (user) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`)
      Swal.fire("¡Éxito!", "Usuario eliminado exitosamente", "success")
      fetchUsers()
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el usuario", "error")
    }
  }

  const handleDeleteConfirmation = (user) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar al usuario ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteUser(user.id)
      }
    })
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Usuarios</CardTitle>
            <CardDescription>Gestiona los usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => {
              setSelectedUser(null)
              setIsFormOpen(true)
            }} className="mb-4 w-full sm:w-auto">
              <PlusIcon className="mr-2 h-4 w-4" /> Agregar Nuevo Usuario
            </Button>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.rol.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button onClick={() => handleEdit(user)} size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleDeleteConfirmation(user)} size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {isFormOpen && (
          <Modal
            show={isFormOpen}
            onClose={() => setIsFormOpen(false)}
          >
            <UserForm
              rols={rols}
              countries={countries}
              user={selectedUser}
              onFormSubmit={() => {
                fetchUsers()
                setIsFormOpen(false)
              }}
            />
          </Modal>
        )}
      </div>
    </AppLayout>
  )
}

export default User
