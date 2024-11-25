'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/Components/ui/button"
import { PlusIcon, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/Components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/Components/ui/card"
import Swal from 'sweetalert2'
import EmployeeForm from './EmployeeForm'
import AppLayout from '@/Layouts/AppLayout'
import Modal from '@/Components/Modal'

const Employees = ({ employees = [], users = [], shifts = [] }) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [employeesData, setEmployeesData] = useState(employees)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees')
      setEmployeesData(response.data)
    } catch (error) {
      console.error("Error recibiendo empleados:", error)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleEdit = (employee) => {
    setSelectedEmployee(employee)
    setIsFormOpen(true)
  }

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`/api/employees/${id}`)
      Swal.fire("¡Éxito!", "Empleado eliminado exitosamente", "success")
      fetchEmployees()
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el empleado", "error")
    }
  }

  const handleDeleteConfirmation = (employee) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar al empleado ${employee.user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteEmployee(employee.id)
      }
    })
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Empleados</CardTitle>
            <CardDescription>Gestiona los empleados</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => {
              setSelectedEmployee(null)
              setIsFormOpen(true)
            }} className="mb-4 w-full sm:w-auto">
              <PlusIcon className="mr-2 h-4 w-4" /> Agregar Nuevo Empleado
            </Button>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Id</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead className="hidden md:table-cell">Fecha de contratación</TableHead>
                    <TableHead className="hidden sm:table-cell">Salario</TableHead>
                    <TableHead className='text-center'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee, index) => (
                    <TableRow key={employee.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{employee.user.name}</TableCell>
                      <TableCell>{employee.shift.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{employee.hire_date}</TableCell>
                      <TableCell className="hidden sm:table-cell">{employee.salary}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button onClick={() => handleEdit(employee)} size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleDeleteConfirmation(employee)} size="sm" variant="destructive">
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
            <EmployeeForm
              users={users}
              shifts={shifts}
              employee={selectedEmployee}
              onFormSubmit={() => {
                fetchEmployees()
                setIsFormOpen(false)
              }}
            />
          </Modal>
        )}
      </div>
    </AppLayout>
  )
}

export default Employees
