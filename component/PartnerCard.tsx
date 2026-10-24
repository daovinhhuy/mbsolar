import Link from "next/link";
import Image from "next/image";
export default function PartnerCard({
  name,
  logoSrc,
  href,
}: {
  name: string;
  logoSrc: string;
  href?: string;
}) {
  const logo = <Image src={logoSrc} alt={name} width={180} height={60} />;

  if (href) {
    return (
      <Link className="partner-card" href={href} aria-label={"Đối tác " + name}>
        {logo}
      </Link>
    );
  }

  return <div className="partner-card">{logo}</div>;
}
