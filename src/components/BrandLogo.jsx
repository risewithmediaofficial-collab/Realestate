import logoSrc from "../assets/myhosurpropertylogo.png";

const BrandLogo = ({ className = "", alt = "MyHosurProperty" }) => (
  <img src={logoSrc} alt={alt} className={`block object-contain ${className}`} />
);

export { logoSrc };
export default BrandLogo;
