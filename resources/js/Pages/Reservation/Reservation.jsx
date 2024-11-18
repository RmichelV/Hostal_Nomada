import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { CalendarIcon, SearchIcon, PlusIcon, MinusIcon } from "lucide-react";
import axios from 'axios';
import Swal from 'sweetalert2';
import AppLayout from '@/Layouts/AppLayout';

export default function FormularioReserva() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1);
    const [fechaEntrada, setFechaEntrada] = useState('');
    const [horaEntrada, setHoraEntrada] = useState('');
    const [fechaSalida, setFechaSalida] = useState('');
    const [horaSalida, setHoraSalida] = useState('');
    const [numPersonas, setNumPersonas] = useState(1);
    const [busqueda, setBusqueda] = useState('');
    const [tipoHabitacion, setTipoHabitacion] = useState('all');
    const [capacidad, setCapacidad] = useState('all');
    const [habitacionesSeleccionadas, setHabitacionesSeleccionadas] = useState({});

    const { roomTypes } = usePage().props;

    // Redirigir a Mis Reservas
    const handleMisReservas = () => {
        window.location.href = '/reservationlist';
    };

    const habitacionesFiltradas = roomTypes.filter(hab =>
        (busqueda === '' || hab.name.toLowerCase().includes(busqueda.toLowerCase())) &&
        (tipoHabitacion === 'all' || hab.tipo === tipoHabitacion) &&
        (capacidad === 'all' || hab.capacidad.toString() === capacidad)
    );

    const ajustarCantidad = (id, incremento) => {
        setHabitacionesSeleccionadas(prev => {
            const nuevaCantidad = (prev[id] || 0) + incremento;
            if (nuevaCantidad <= 0) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: nuevaCantidad };
        });
    };

    const calcularTotal = () => {
        return Object.entries(habitacionesSeleccionadas).reduce((total, [id, cantidad]) => {
            const habitacion = roomTypes.find(h => h.id === parseInt(id));
            return total + (habitacion.price * cantidad);
        }, 0);
    };

    const validarPaso1 = () => {
        const nuevosErrores = {};

        if (!fechaEntrada) nuevosErrores.fechaEntrada = 'La fecha de entrada es obligatoria.';
        if (!fechaSalida) nuevosErrores.fechaSalida = 'La fecha de salida es obligatoria.';
        if (new Date(fechaEntrada) >= new Date(fechaSalida)) nuevosErrores.fechaSalida = 'La fecha de salida debe ser posterior a la fecha de entrada.';
        if (!numPersonas || numPersonas <= 0) nuevosErrores.numPersonas = 'El número de personas debe ser al menos 1.';
        if (calcularTotal() === 0) nuevosErrores.habitaciones = 'Debe seleccionar al menos una habitación.';

        setErrors(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleNextStep = () => {
        if (validarPaso1()) {
            setStep(2);
        }
    };

    const handleConfirmarReserva = async () => {
        setLoading(true);
        setError(null);

        const rooms = Object.entries(habitacionesSeleccionadas).map(([id, quantity]) => {
            return {
                room_type_id: parseInt(id),
                quantity: quantity,
            };
        });

        const formData = {
            check_in: `${fechaEntrada} ${horaEntrada}`,
            check_out: `${fechaSalida} ${horaSalida}`,
            number_of_people: numPersonas,
            rooms,
        };

        try {
            await axios.post('/api/reservations', formData);
            Swal.fire({
                title: '¡Éxito!',
                text: 'Reserva creada exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = '/dashboard';
            });
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.data) {
                const validationErrors = error.response.data.errors;
                let errorMessage = "Ocurrió un error al crear la reserva.";

                if (validationErrors) {
                    const errorDetails = Object.values(validationErrors).map((messages) => messages.join(' ')).join(' ');
                    errorMessage = errorDetails || "Ocurrió un error en la validación.";
                }

                setError(errorMessage);
                Swal.fire({
                    title: 'Error',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                setError("Ocurrió un error inesperado.");
                Swal.fire({
                    title: 'Error',
                    text: "Ocurrió un error inesperado.",
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Card>
                        <CardContent className="space-y-4 pt-6">
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
                        </CardContent>
                        <Button className="mt-4" onClick={handleNextStep} disabled={calcularTotal() === 0}>Siguiente</Button>
                    </Card>
                );
            case 2:
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Confirmar Reserva</h2>
                        <div className="mt-4">
                            <p><strong>Fecha de Entrada:</strong> {fechaEntrada} {horaEntrada}</p>
                            <p><strong>Fecha de Salida:</strong> {fechaSalida} {horaSalida}</p>
                            <p><strong>Total:</strong> Bs.{calcularTotal()}</p>
                        </div>
                        <Button
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                >
                                    Atras
                                </Button>
                        <Button
                            className="mt-6"
                            onClick={handleConfirmarReserva}
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Confirmar Reserva'}
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Formulario de Reserva</h2>
                    <Button onClick={handleMisReservas}>Mis Reservas</Button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {renderStep()}
            </div>
        </AppLayout>
    );
}
