import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "«Поэзия звука»",
};

/*
  Pass-through on purpose: `[locale]/layout.tsx` owns <html> and <body>. Rendering
  them here too nests a second document, which breaks client-side locale switches
  (refs end up pointing at detached nodes and the door hero freezes).
*/
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
