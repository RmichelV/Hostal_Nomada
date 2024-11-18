import React from 'react';

export default function ApplicationMark(
  props: React.SVGProps<SVGSVGElement>,
) {
  return (
    <img
        {...props}
        src="/img/Logo.png"
        alt="Una noche en La Paz"
    />
  );
}
