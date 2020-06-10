import React from "react"

// Como a propriedade title deve se comportar
interface HeaderProps {
  title: string,
  // "?" Significa propiedade não obrigatória
  subtitle?: string
}

const Header: React.FC<HeaderProps> = ({title, subtitle}) => {
  return (
    <header>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </header>
  )
}

export default Header
