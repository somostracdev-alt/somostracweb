export const labelKinds = ["account", "format", "pillar", "status"] as const;
export type LabelKind = (typeof labelKinds)[number];

export type OpsLabel = {
  kind: LabelKind;
  name: string;
  color: string;
  sort: number;
};

export const defaultLabels: OpsLabel[] = [
  { kind: "account", name: "Gallagro", color: "#4f6f52", sort: 0 },
  { kind: "account", name: "Gallatrack", color: "#6b7c3f", sort: 1 },
  { kind: "account", name: "Grupo Gallagro", color: "#3f5e4a", sort: 2 },
  { kind: "format", name: "Reel", color: "#5b6ea8", sort: 0 },
  { kind: "format", name: "Carrusel", color: "#3d7a8c", sort: 1 },
  { kind: "format", name: "Placa", color: "#c46a3a", sort: 2 },
  { kind: "format", name: "Historia", color: "#7a5a8c", sort: 3 },
  { kind: "format", name: "Video", color: "#4f6f52", sort: 4 },
  { kind: "pillar", name: "Comercial", color: "#c46a3a", sort: 0 },
  { kind: "pillar", name: "Informativo/trend", color: "#3d7a8c", sort: 1 },
  { kind: "pillar", name: "RRHH", color: "#5b6ea8", sort: 2 },
  { kind: "pillar", name: "Repuestos", color: "#6b7c3f", sort: 3 },
  { kind: "pillar", name: "Valor marca", color: "#7a5a8c", sort: 4 },
  { kind: "status", name: "Idea", color: "#7a8176", sort: 0 },
  { kind: "status", name: "En diseño", color: "#c4a056", sort: 1 },
  { kind: "status", name: "Diseño terminado", color: "#3d8a7a", sort: 2 },
  { kind: "status", name: "Programada", color: "#5b6ea8", sort: 3 },
  { kind: "status", name: "Publicada", color: "#4f6f52", sort: 4 },
  { kind: "status", name: "Esperando material", color: "#c46a3a", sort: 5 },
  { kind: "status", name: "Material recibido", color: "#6b7c3f", sort: 6 },
  { kind: "status", name: "No se publicó", color: "#a45b5b", sort: 7 },
  { kind: "status", name: "No recibimos info", color: "#8a6a5a", sort: 8 },
];

export function labelTone(color: string) {
  return {
    color,
    background: `${color}22`,
    border: `${color}55`,
  };
}
