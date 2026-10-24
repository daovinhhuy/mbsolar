import { getDatabaseConnection } from "@/app/api/connectionDB";
import type { PartnerRow } from "@/types/partner";

const partnerSelect = `
  SELECT
    id,
    name,
    logo,
    image,
    website,
    description,
    intro_title AS "introTitle",
    intro_text AS "introText"
  FROM partners
`;

export async function getPartners(): Promise<PartnerRow[]> {
  const pool = getDatabaseConnection();
  const { rows } = await pool.query<PartnerRow>(
    `${partnerSelect} ORDER BY sort_order, id`,
  );
  return rows;
}

export async function getPartnerById(id: number): Promise<PartnerRow | null> {
  if (!Number.isInteger(id)) return null;

  const pool = getDatabaseConnection();
  const { rows } = await pool.query<PartnerRow>(
    `${partnerSelect} WHERE id = $1 LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export function getPartnerRouteKey(partner: Pick<PartnerRow, "id" | "name">) {
  const name = partner.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${partner.id}-${name}`;
}
