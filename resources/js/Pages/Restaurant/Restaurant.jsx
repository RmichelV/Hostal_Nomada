'use client'

import React from 'react'
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
// import { Separator } from "@/Components/ui/separator"
import { MenuIcon, PhoneIcon, MapPinIcon, ClockIcon } from 'lucide-react'
import Layout from '../../Layouts/Layout'  // Asegúrate de que Layout esté importado
import { usePage } from '@inertiajs/react'
import RestaurantMainPage from './RestaurantMainPage'
import AppLayout from '@/Layouts/AppLayout'

export default function Restaurant({ dishes }) {
    const { props } = usePage();
    const { auth } = props;
    const userr = auth?.user;

    return (
        userr ? (
            <AppLayout>
                <RestaurantMainPage dishes={dishes} />
            </AppLayout>
        ) : (
            <Layout>
                <RestaurantMainPage dishes={dishes} />
            </Layout>
        )
    );
}
