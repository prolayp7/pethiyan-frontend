import FooterSeoContent from "./FooterSeoContent";

interface FooterSeoWrapperProps {
  shouldRender: boolean;
  introHtml?: string;
}

export default function FooterSeoWrapper({ shouldRender, introHtml }: FooterSeoWrapperProps) {
  if (!shouldRender) return null;

  return <FooterSeoContent introHtml={introHtml} />;
}
