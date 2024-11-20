import React, { useEffect, useState } from 'react'
import { LineChart, BarChart, PieChart, Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter,Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Head } from '@inertiajs/react';

import { LineChart as LineChartIcon, BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react'

export default function DashContent() {
  const salesData = [
    { name: 'Jan', sales: 4000, cost: 2400 },
    { name: 'Feb', sales: 3000, cost: 1398 },
    { name: 'Mar', sales: 2000, cost: 9800 },
    { name: 'Apr', sales: 2780, cost: 3908 },
    { name: 'May', sales: 1890, cost: 4800 },
    { name: 'Jun', sales: 2390, cost: 3800 },
    { name: 'Jul', sales: 3490, cost: 4300 },
  ]

  const earningsData = [
    { name: 'Pension', value: 251 },
    { name: 'Accesorios', value: 176 },
  ]

  const roomsData = [
    { day: 'L', rooms: 10 },
    { day: 'M', rooms: 15 },
    { day: 'M', rooms: 12 },
    { day: 'J', rooms: 18 },
    { day: 'V', rooms: 20 },
    { day: 'S', rooms: 22 },
    { day: 'D', rooms: 16 },
  ]

  // const regressionData = [
  //   { x: 1, y: 3 },
  //   { x: 2, y: 5 },
  //   { x: 3, y: 4 },
  //   { x: 4, y: 7 },
  //   { x: 5, y: 6 },
  //   { x: 6, y: 8 },
  //   { x: 7, y: 9 },
  // ]

  const calculateRegression = (data) => {
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += data[i].x;
      sumY += data[i].y;
      sumXY += data[i].x * data[i].y;
      sumX2 += data[i].x * data[i].x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return data.map(point => ({
      x: point.x,
      y: point.y,
      yRegression: slope * point.x + intercept
    }));
  }
  // const regressionDataWithLine = calculateRegression(regressionData);
  const [dashboardData, setDashboardData] = useState({
    userCount: 0,
    totalReservations: 0,
    cancelledReservations: 0,
    availableRooms: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    // Llamada a la API para obtener los datos
    axios.get('/dashboard-data')
      .then(response => {
        setDashboardData(response.data);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
      });
  }, []);
  const [regressionData, setRegressionData] = useState([]);
  const regressionDataWithLine = calculateRegression(regressionData);

useEffect(() => {
  axios.get('/forecast') // Ajusta la URL a la ruta de tu API de Laravel
    .then((response) => {
      if (response.data.forecast) {
        // Aquí manejas la estructura de los datos recibidos
        const forecastData = Object.entries(response.data.forecast).map(([date, value]) => ({
          x: new Date(date).getTime(),  // Convertimos la fecha a un timestamp para usarla en el gráfico
          y: value,
        }));
        setRegressionData(forecastData);
      }
    })
    .catch((error) => {
      console.error("Error fetching regression data:", error);
    });
}, []); // Solo se ejecuta una vez cuando el componente se monta

    return (
        // <div className="relative h-[300px] w-full">

      <div className="flex-1 p-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-6 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Total de Huespedes</div>
              <div className="text-2xl font-bold">{dashboardData.userCount}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Total de Reservas</div>
              <div className="text-2xl font-bold">{dashboardData.totalReservations}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Reservas Canceladas</div>
              <div className="text-2xl font-bold">{dashboardData.cancelledReservations}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Habitaciones Disponibles</div>
              <div className="text-2xl font-bold">{dashboardData.availableRooms}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Ingreso Total</div>
              <div className="text-2xl font-bold">Bs. {dashboardData.totalEarnings}</div>
            </div>
          </div>
        </Card>
      </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-8">
          {/* Sales Chart */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-lg font-bold">Bs.855.8k</div>
                <div className="text-sm text-gray-500">Gross Sales</div>
              </div>
              <Select defaultValue="this-week">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="cost" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>




          {/* Rooms Reserved Chart */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-bold">Habitaciones Reservadas</div>
              <Select defaultValue="esta-semana">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="esta-semana">Esta Semana</SelectItem>
                  <SelectItem value="semana-pasada">Semana Pasada</SelectItem>
                  <SelectItem value="este-mes">Este Mes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roomsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rooms" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        {/* Earnings Chart */}
        <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-bold">Earnings</div>
              <Select defaultValue="this-week">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={earningsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {earningsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#0088FE' : '#00C49F'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          {/* Linear Regression Chart */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-bold">Análisis de Regresión</div>
              {/* <Select defaultValue="this-week">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
            <ResponsiveContainer width="100%" height={300}>
    <ScatterChart>
      <CartesianGrid />
      <XAxis
        type="number"
        dataKey="x"
        name="Fecha"
        domain={['dataMin', 'dataMax']}
        tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
      />
      <YAxis
        type="number"
        dataKey="y"
        name="Valor"
        domain={['auto', 'auto']}
      />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      
      {/* Puntos de dispersión */}
      <Scatter
        name="Datos"
        data={regressionDataWithLine}
        fill="#8884d8"
        shape="circle"
        size={8} // Tamaño de los puntos
      />
      
      {/* Línea de regresión */}
      <Line
        type="monotone"
        dataKey="yRegression"
        stroke="#ff7300"
        dot={false}
        activeDot={false}
        legendType="none"
      />
    </ScatterChart>
  </ResponsiveContainer>
          </Card>
        </div>
      </div>
    // </div>
    )
}
