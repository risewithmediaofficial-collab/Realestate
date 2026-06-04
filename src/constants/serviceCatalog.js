import {
  BrokerIcon,
  BuildingOffice2Icon,
  CreditCardIcon,
  DocumentMagnifyingGlassIcon,
  DocumentTextIcon,
  ElectricalIcon,
  EngineeringIcon,
  GardenIcon,
  HandshakeIcon,
  HomeModernIcon,
  InteriorIcon,
  LandIcon,
  LoanIcon,
  ManagementIcon,
  MapIcon,
  PaintBrushIcon,
  PestControlIcon,
  PlumbingIcon,
  PropertySearchIcon,
  RegistrationIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TransportIcon,
  VillaIcon,
  WrenchScrewdriverIcon,
} from "../components/AppIcons";

/** Hero + request-service links — Home and Office Service */
export const HOME_OFFICE_SERVICE_SHORTCUTS = [
  { label: "Apartment", category: "property_management", type: "Apartment" },
  { label: "Industry", category: "property_management", type: "Industry" },
  { label: "Maintenance", category: "property_management", type: "Maintenance" },
  { label: "AMC Service", category: "property_management", type: "AMC Service" },
];

/** Hero + request-service links — Property Management Service */
export const PROPERTY_MANAGEMENT_SHORTCUTS = [
  { label: "NRI Property Management Service", category: "property_management", type: "NRI Property Management Service" },
  { label: "Farm House", category: "property_management", type: "Farm Management" },
  { label: "Bungalow", category: "property_management", type: "Bungalow Management" },
  { label: "Agriculture Land Maintenance", category: "property_management", type: "Agriculture Land Maintenance" },
  { label: "House Management", category: "property_management", type: "House Management" },
];

export const buildServiceRequestPath = ({ category, type }) => {
  const params = new URLSearchParams({ category });
  if (type) params.set("type", type);
  return `/request-service?${params.toString()}`;
};

export const serviceCategories = [
  {
    key: "buy-sell-rent",
    title: "Buy / Sell / Rent",
    description: "We help customers buy, sell, and rent properties with complete assistance.",
    icon: BrokerIcon,
    services: [
      { label: "Property legal service", icon: ScaleIcon },
      { label: "Sale agreement support", icon: HandshakeIcon },
      { label: "Property buying guidance", icon: HomeModernIcon },
      { label: "Property selling guidance", icon: BrokerIcon },
    ],
  },
  {
    key: "loan-services",
    title: "Loan Services",
    description: "Fast and reliable loan assistance for various property requirements.",
    icon: LoanIcon,
    services: [
      { label: "Home loan", icon: HomeModernIcon },
      { label: "Plot loan", icon: LandIcon },
      { label: "Commercial loan", icon: BuildingOffice2Icon },
      { label: "Agriculture loan", icon: GardenIcon },
      { label: "Home loan balance transfer", icon: CreditCardIcon },
    ],
  },
  {
    key: "registration-services",
    title: "Registration Services",
    description: "End-to-end documentation and registration assistance.",
    icon: RegistrationIcon,
    services: [
      { label: "Sale deed registration", icon: DocumentTextIcon },
      { label: "Patta transfer", icon: RegistrationIcon },
      { label: "Land survey", icon: MapIcon },
    ],
  },
  {
    key: "property-search",
    title: "Property Search",
    description: "Find suitable properties based on your requirements.",
    icon: PropertySearchIcon,
    services: [
      { label: "Plot search", icon: LandIcon },
      { label: "Commercial property search", icon: BuildingOffice2Icon },
      { label: "Agriculture land search", icon: GardenIcon },
    ],
  },
  {
    key: "interior-construction",
    title: "Interior & Construction",
    description: "Premium interior and construction solutions.",
    icon: InteriorIcon,
    services: [
      { label: "Home interiors", icon: InteriorIcon },
      { label: "Office interiors", icon: PaintBrushIcon },
      { label: "Construction services", icon: EngineeringIcon },
      { label: "Approval plans", icon: DocumentMagnifyingGlassIcon },
    ],
  },
  {
    key: "property-management",
    title: "Property Management Service",
    description: "Comprehensive maintenance and management for all types of properties.",
    icon: ManagementIcon,
    services: PROPERTY_MANAGEMENT_SHORTCUTS.map((item) => ({
      label: item.label,
      icon: item.label.includes("NRI") ? ShieldCheckIcon : item.label.includes("Farm") ? GardenIcon : item.label.includes("Bungalow") ? VillaIcon : item.label.includes("Agriculture") ? GardenIcon : HomeModernIcon,
      requestPath: buildServiceRequestPath(item),
    })),
  },
  {
    key: "home-office-services",
    title: "Home & Office Services",
    description: "Apartment, industry, maintenance, AMC, and complete home and office support.",
    icon: WrenchScrewdriverIcon,
    services: [
      ...HOME_OFFICE_SERVICE_SHORTCUTS.map((item) => ({
        label: item.label,
        icon: ManagementIcon,
        requestPath: buildServiceRequestPath(item),
      })),
      { label: "Home & Office Cleaning", icon: SparklesIcon },
      { label: "Home & Office Shifting (Packers & Movers)", icon: TransportIcon },
      { label: "Home Appliance Service (TV, Fridge, Washing Machine Repair)", icon: WrenchScrewdriverIcon },
      { label: "Electrical & Plumbing Service", icon: ElectricalIcon },
      { label: "Carpentry & Interior Work", icon: PaintBrushIcon },
      { label: "Pest Control Service", icon: PestControlIcon },
      { label: "Bathroom Cleaning (Toilet Acid Wash)", icon: SparklesIcon },
      { label: "Tank & Sump Cleaning", icon: PlumbingIcon },
      { label: "Painting Work", icon: PaintBrushIcon },
      { label: "Sofa Cleaning", icon: SparklesIcon },
      { label: "Carpet Cleaning", icon: SparklesIcon },
      { label: "Land Scaping", icon: GardenIcon },
      { label: "Garden Maintenance", icon: GardenIcon },
    ],
  },
];

export const serviceQuickLinks = serviceCategories.map(({ key, title, icon }) => ({
  key,
  title,
  icon,
}));
