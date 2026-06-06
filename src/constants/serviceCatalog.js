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
  WrenchScrewdriverIcon,
} from "../components/AppIcons";

/** Hero + request-service links — Home and Office Service */
export const HOME_OFFICE_SERVICE_SHORTCUTS = [
  {
    label: "Home & Office Cleaning Service - Deep Cleaning",
    category: "home_office_services",
    type: "Home & Office Cleaning Service - Deep Cleaning",
  },
  {
    label: "Home & Office Shifting Service - Packers & Movers",
    category: "home_office_services",
    type: "Home & Office Shifting Service - Packers & Movers",
  },
  {
    label: "Home Appliance Service - TV, Fridge, Washing Machine Service",
    category: "home_office_services",
    type: "Home Appliance Service - TV, Fridge, Washing Machine Service",
  },
  {
    label: "Electrical & Plumbing Service",
    category: "home_office_services",
    type: "Electrical & Plumbing Service",
  },
  {
    label: "Interior & Carpentry Work",
    category: "home_office_services",
    type: "Interior & Carpentry Work",
  },
  {
    label: "Pest Control Service",
    category: "home_office_services",
    type: "Pest Control Service",
  },
  {
    label: "Tank, Sump & Bathroom Cleaning Service",
    category: "home_office_services",
    type: "Tank, Sump & Bathroom Cleaning Service",
  },
  {
    label: "Painting Work",
    category: "home_office_services",
    type: "Painting Work",
  },
  {
    label: "Sofa & Carpet Cleaning",
    category: "home_office_services",
    type: "Sofa & Carpet Cleaning",
  },
];

/** Hero + request-service links — Property Management Service */
export const PROPERTY_MANAGEMENT_SHORTCUTS = [
  {
    label: "Home & Apartment Facility AMC Service",
    category: "property_management",
    type: "Home & Apartment Facility AMC Service",
  },
  {
    label: "Industry & Warehouse Facility AMC Service",
    category: "property_management",
    type: "Industry & Warehouse Facility AMC Service",
  },
  {
    label: "Land Scraping & Garden Maintenance Property Management Service",
    category: "property_management",
    type: "Land Scraping & Garden Maintenance Property Management Service",
  },
  {
    label: "NRI Property Management Service",
    category: "property_management",
    type: "NRI Property Management Service",
  },
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
      icon: item.label.includes("NRI")
        ? ShieldCheckIcon
        : item.label.includes("Garden") || item.label.includes("Land")
          ? GardenIcon
          : item.label.includes("Warehouse")
            ? BuildingOffice2Icon
            : HomeModernIcon,
      requestPath: buildServiceRequestPath(item),
    })),
  },
  {
    key: "home-office-services",
    title: "Home & Office Services",
    description: "Cleaning, shifting, appliance care, repairs, and complete support for home and office spaces.",
    icon: WrenchScrewdriverIcon,
    services: HOME_OFFICE_SERVICE_SHORTCUTS.map((item) => ({
      label: item.label,
      icon: item.label.includes("Cleaning")
        ? SparklesIcon
        : item.label.includes("Shifting")
          ? TransportIcon
          : item.label.includes("Appliance")
            ? WrenchScrewdriverIcon
            : item.label.includes("Electrical")
              ? ElectricalIcon
              : item.label.includes("Plumbing")
                ? PlumbingIcon
                : item.label.includes("Interior") || item.label.includes("Carpentry")
                  ? PaintBrushIcon
                  : item.label.includes("Pest")
                    ? PestControlIcon
                    : PaintBrushIcon,
      requestPath: buildServiceRequestPath(item),
    })),
  },
];

export const serviceQuickLinks = serviceCategories.map(({ key, title, icon }) => ({
  key,
  title,
  icon,
}));
