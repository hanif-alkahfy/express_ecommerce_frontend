import { Card as FlowbiteCard } from 'flowbite-react';

export default function Card({
  children,
  title,
  subtitle,
  href,
  imgAlt,
  imgSrc,
  className = '',
  ...props
}) {
  return (
    <FlowbiteCard
      href={href}
      className={`${className}`}
      {...props}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt={imgAlt || 'Card image'}
          className="w-full h-48 object-cover"
        />
      )}
      {(title || subtitle) && (
        <FlowbiteCard.Header>
          {title && <FlowbiteCard.Title>{title}</FlowbiteCard.Title>}
          {subtitle && <FlowbiteCard.Description>{subtitle}</FlowbiteCard.Description>}
        </FlowbiteCard.Header>
      )}
      <FlowbiteCard.Body>
        {children}
      </FlowbiteCard.Body>
    </FlowbiteCard>
  );
}
