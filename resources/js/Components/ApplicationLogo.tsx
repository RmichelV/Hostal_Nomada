import React from 'react';

export default function ApplicationLogo(props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLImageElement> & React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
        {...props}
        src="/img/Logo.png"
        alt="Una noche en La Paz"
    />
  );
}
