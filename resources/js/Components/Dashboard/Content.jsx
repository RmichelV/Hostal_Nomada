import React from 'react'
import RoomCarousel from './RoomCarrousel'
import CustomerComments from './Comments'

export default function Content() {
    return (
        <div className="relative w-full">
          <div className="absolute h-[300px] inset-0">
            <img
              src="/img/LaPaz.png"
              alt="Una noche en La Paz"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="relative h-full flex flex-col items-center justify-between pt-32 pb-16 px-4">
            <div className="text-center text-white space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-wider">
                HOSTAL NOMADA SUITES
              </h1>
              <h2 className="text-xl md:text-2xl">
                El mejor hostal ubicado en la ciudad Maravilla La Paz-Boliva
              </h2>
            </div>
          </div>
          <div className="pt-7 pb-16 px-4">
            <RoomCarousel />
          </div>
          <CustomerComments/>
        </div>
      )
}
