import logoSrc from "../assets/brand-logo.png";

const BrandLogo = ({ className = "", alt = "MyHosurProperty" }) => (
  <img src={logoSrc} alt={alt} className={`block object-contain ${className}`} />
);

export { logoSrc };
export default BrandLogo;
