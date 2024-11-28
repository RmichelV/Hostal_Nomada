// 'use client'

// import React, { useState, useEffect } from 'react'
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/Components/ui/select"
// import { Button } from "@/Components/ui/button"
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableHeader, 
//   TableRow 
// } from "@/Components/ui/table"
// import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
// import { Input } from '@/Components/ui/input'
// import html2pdf from 'html2pdf.js'
// import * as XLSX from 'xlsx'
// import axios from 'axios'
// // import html2pdf from 'html2pdf.js';
// // import * as XLSX from 'xlsx';
// import { FileIcon as FilePdf, FileSpreadsheet, Printer, Copy } from 'lucide-react'
// import '@fortawesome/fontawesome-free/css/all.css';
// import AppLayout from '@/Layouts/AppLayout'

// const Reports = ({ initialUsers = [], initialSupplies = [], initialReservations = [] }) => {
//   const [report, setReport] = useState('1')
//   const [users, setUsers] = useState(initialUsers)
//   const [supplies, setSupplies] = useState(initialSupplies)
//   const [reservations, setReservations] = useState(initialReservations)

//   const [search, setSearch] = useState('')
//   const [loading, setLoading] = useState(false)

//   const types = [
//     { id: '1', name: 'Usuarios' },
//     { id: '2', name: 'Insumos' },
//     { id: '3', name: 'Reservas' },
//   ]

//   useEffect(() => {
//     handleSearch() // Cargar datos iniciales
//   }, [report])

//   const exportPDF = () => {
//     const element = document.getElementById('reportsTable')
//     html2pdf().from(element).set({
//       margin: 1,
//       filename: 'report.pdf',
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
//     }).save()
//   }

//   const exportExcel = () => {
//     const table = document.getElementById('reportsTable')
//     const wb = XLSX.utils.table_to_book(table, { sheet: 'Sheet JS' })
//     XLSX.writeFile(wb, 'report.xlsx')
//   }

//   const printReport = () => {
//     const printContent = document.getElementById('reportsTable').outerHTML
//     const printWindow = window.open('', '', 'width=800,height=600')
//     printWindow.document.write('<html><head><title>Print Report</title></head><body>')
//     printWindow.document.write(printContent)
//     printWindow.document.write('</body></html>')
//     printWindow.document.close()
//     printWindow.print()
//   }
//   const copyToClipboard = () => {
//     const table = document.getElementById('reportsTable');
//     const range = document.createRange();
//     range.selectNode(table);
//     const selection = window.getSelection();
//     selection.removeAllRanges();
//     selection.addRange(range);
//     document.execCommand('copy');
//     alert('Copiado al portapapeles');
//   };
//   const handleSearch = async () => {
//     setLoading(true)
//     try {
//       const response = await axios.post('/dashboard/report', {
//         user_search: report === '1' ? search : '',
//         supply_search: report === '2' ? search : '',
//         reservation_search: report === '3' ? search : '',
//       })

//       const { users, supplies, reservations } = response.data

//       if (report === '1') setUsers(users)
//       if (report === '2') setSupplies(supplies)
//       if (report === '3') setReservations(reservations)
//     } catch (error) {
//       console.error('Error al buscar los datos:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <AppLayout>
//     <div className="p-4">
//       <Card className="w-full max-w-4xl mx-auto">
//         <CardHeader>
//           <CardTitle>Reportes</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {/* Barra de búsqueda */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//               <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
//                 <Select onValueChange={setReport} defaultValue={report}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Seleccionar reporte" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {types.map((type) => (
//                       <SelectItem key={type.id} value={type.id}>
//                         {type.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <Input 
//                 placeholder="Buscar..." 
//                 value={search} 
//                 onChange={(e) => setSearch(e.target.value)} 
//                 className="w-full sm:w-1/3 mb-4 sm:mb-0"
//               />
//               <Button onClick={handleSearch} disabled={loading}>
//                 {loading ? 'Cargando...' : 'Buscar'}
//               </Button>
//             </div>

//             {/* Tabla de reportes */}
//             <div className="overflow-x-auto">
//               <Table id="reportsTable">
//                 <TableHeader>
//                   {report === '1' && (
//                     <TableRow>
//                       <TableHead className="w-[50px]">#</TableHead>
//                       <TableHead>Nombre</TableHead>
//                       <TableHead>Email</TableHead>
//                       <TableHead>Identificación</TableHead>
//                       <TableHead>Teléfono</TableHead>
//                     </TableRow>
//                   )}
//                   {report === '2' && (
//                     <TableRow>
//                       <TableHead className="w-[50px]">#</TableHead>
//                       <TableHead>Nombre</TableHead>
//                       <TableHead>Descripción</TableHead>
//                       <TableHead>Precio</TableHead>
//                     </TableRow>
//                   )}
//                   {report === '3' && (
//                     <TableRow>
//                       <TableHead className="w-[50px]">#</TableHead>
//                       <TableHead>Usuario</TableHead>
//                       <TableHead>Habitaciones</TableHead>
//                       <TableHead>Personas</TableHead>
//                       <TableHead>Check-in</TableHead>
//                       <TableHead>Check-out</TableHead>
//                       <TableHead>Precio Total</TableHead>
//                     </TableRow>
//                   )}
//                 </TableHeader>
//                 <TableBody>
//                   {report === '1' && users.length > 0 ? (
//                     users.map((user, index) => (
//                       <TableRow key={user.id}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{user.name}</TableCell>
//                         <TableCell>{user.email}</TableCell>
//                         <TableCell>{user.identification_number}</TableCell>
//                         <TableCell>{user.phone}</TableCell>
//                       </TableRow>
//                     ))
//                   ) : report === '2' && supplies.length > 0 ? (
//                     supplies.map((supply, index) => (
//                       <TableRow key={supply.id}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{supply.name}</TableCell>
//                         <TableCell>{supply.description}</TableCell>
//                         <TableCell>{supply.price}</TableCell>
//                       </TableRow>
//                     ))
//                   ) : report === '3' && reservations.length > 0 ? (
//                     reservations.map((reservation, index) => (
//                       <TableRow key={reservation.id}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{reservation.user_name}</TableCell>
//                         <TableCell>{reservation.number_of_rooms}</TableCell>
//                         <TableCell>{reservation.number_of_people}</TableCell>
//                         <TableCell>{reservation.check_in}</TableCell>
//                         <TableCell>{reservation.check_out}</TableCell>
//                         <TableCell>{reservation.total_price}</TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={7} className="text-center">
//                         {loading ? 'Cargando datos...' : 'No se encontraron resultados.'}
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>

//             <div className="flex justify-end space-x-2">

//                   <div className="flex flex-wrap gap-2">
//                     <Button onClick={exportPDF} variant="destructive" className="bg-black hover:bg-slate-900 " size="sm">
//                       <FilePdf className="mr-2 h-4 w-4 text-red-400 hover:text-red-700" /> PDF
//                     </Button>
//                     <Button onClick={exportExcel} variant="default" size="sm" className="bg-black hover:bg-slate-900">
//                       <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600 hover:text-green-700" /> Excel
//                     </Button>
//                     <Button onClick={printReport} variant="secondary" className="bg-black hover:bg-slate-900  text-white" size="sm">
//                       <Printer className="mr-2 h-4 w-4 text-white hover:text-white" /> Print
//                     </Button>
//                     <Button onClick={copyToClipboard} variant="outline" size="sm">
//                       <Copy className="mr-2 h-4 w-4" /> Copy
//                     </Button>
//                   </div>

//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//     </AppLayout>
//   )
// }

// export default Reports
