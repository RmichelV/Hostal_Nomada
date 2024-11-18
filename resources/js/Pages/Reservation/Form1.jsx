// FormularioPaso1.js
import { useState } from 'react';
// import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
// import { CalendarIcon, SearchIcon, PlusIcon, MinusIcon } from "lucide-react";
import { CalendarIcon, SearchIcon, MinusIcon, PlusIcon } from "lucide-react";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";

const FormularioPaso1 = ({ 
    roomTypes, 
    habitacionesFiltradas, 
    habitacionesSeleccionadas, 
    setHabitacionesSeleccionadas, 
    busqueda, 
    setBusqueda, 
    tipoHabitacion, 
    setTipoHabitacion, 
    numPersonas, 
    setNumPersonas, 
    fechaEntrada, 
    setFechaEntrada, 
    fechaSalida, 
    setFechaSalida, 
    errors, 
    ajustarCantidad, 
    calcularTotal, 
    handleNextStep 
  }) => {    return (
        <div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fechaEntrada">Fecha de Entrada</Label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="fechaEntrada"
                            type="date"
                            value={fechaEntrada}
                            onChange={(e) => setFechaEntrada(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    {errors.fechaEntrada && <p className="text-red-500 text-sm">{errors.fechaEntrada}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fechaSalida">Fecha de Salida</Label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="fechaSalida"
                            type="date"
                            value={fechaSalida}
                            onChange={(e) => setFechaSalida(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    {errors.fechaSalida && <p className="text-red-500 text-sm">{errors.fechaSalida}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="numPersonas">Número de Personas</Label>
                    <Input
                        id="numPersonas"
                        type="number"
                        value={numPersonas}
                        onChange={(e) => setNumPersonas(e.target.value)}
                        min="1"
                    />
                    {errors.numPersonas && <p className="text-red-500 text-sm">{errors.numPersonas}</p>}
                </div>
            </div>
            <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                    <Label htmlFor="busqueda" className="sr-only">Buscar habitación</Label>
                    <div className="relative">
                        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="busqueda"
                            placeholder="Buscar habitación"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
                <Select value={tipoHabitacion} onValueChange={setTipoHabitacion}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Tipo de habitación" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="matrimonial">Matrimonial</SelectItem>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="doble">Doble</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Habitación</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Seleccionar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {habitacionesFiltradas.map(habitacion => (
                        <TableRow key={habitacion.id}>
                            <TableCell>
                                <div className="flex items-center space-x-3">
                                    <div>
                                        <p className="text-sm font-medium leading-none">{habitacion.name}</p>
                                        <p className="text-sm text-muted-foreground">{habitacion.tipo}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>${habitacion.price}</TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-2">
                                    <Button onClick={() => ajustarCantidad(habitacion.id, -1)}><MinusIcon className="h-4 w-4" /></Button>
                                    <span>{habitacionesSeleccionadas[habitacion.id] || 0}</span>
                                    <Button onClick={() => ajustarCantidad(habitacion.id, 1)}><PlusIcon className="h-4 w-4" /></Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => handleNextStep()}>Siguiente</Button>
      </div>
        </div>
    );
};

export default FormularioPaso1;
