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
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [showDeletedUsers, setShowDeletedUsers] = useState(false);


  useEffect(() => {
    fetchUsers()
  }, [])

  const handleEdit = (user) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      Swal.fire("¡Éxito!", "Usuario eliminado exitosamente", "success");
      setUsersData((prevUsers) => prevUsers.filter((user) => user.id !== id));
      const deletedUser = usersData.find((user) => user.id === id);
      if (deletedUser) {
        setDeletedUsers((prevDeleted) => [...prevDeleted, { ...deletedUser, isDeleted: true }]);
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      Swal.fire("Error", "No se pudo eliminar el usuario", "error");
    }
  };
  
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
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsersData(response.data.filter(user => !user.isDeleted));
      setDeletedUsers(response.data.filter(user => user.isDeleted));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRestoreUser = async (id) => {
    try {
      await axios.put(`/api/users/${id}/restore`);
      Swal.fire("¡Éxito!", "Usuario restaurado exitosamente", "success");
      fetchUsers();
    } catch (error) {
      Swal.fire("Error", "No se pudo restaurar el usuario", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Usuarios</CardTitle>
            <CardDescription>Gestiona los usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <Button
                onClick={() => {
                  setSelectedUser(null);
                  setIsFormOpen(true);
                }}
                className="w-full sm:w-auto"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Agregar Nuevo Usuario
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowDeletedUsers(!showDeletedUsers)}
                className="w-full sm:w-auto"
              >
                {showDeletedUsers ? 'Ver Usuarios Activos' : 'Ver Usuarios Eliminados'}
              </Button>
            </div>
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
                  {(showDeletedUsers ? deletedUsers : usersData).map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.rol?.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap justify-center gap-2">
                          {!showDeletedUsers ? (
                            <>
                              <Button onClick={() => handleEdit(user)} size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteConfirmation(user)}
                                size="sm"
                                variant="destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => handleRestoreUser(user.id)}
                              size="sm"
                              variant="secondary"
                            >
                              Restaurar
                            </Button>
                          )}
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
                fetchUsers();
                setIsFormOpen(false);
              }}
            />
          </Modal>
        )}
      </div>
    </AppLayout>
  );

}

export default User
