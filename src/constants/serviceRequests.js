export const PROPERTY_REQUEST_TYPES = [
  "Apartment",
  "Villa",
  "Independent House",
  "Plot",
  "Commercial",
  "House",
  "Office",
  "Warehouse",
  "Land",
  "Industrial Shed",
];

export const RENT_REQUEST_TYPES = ["House", "Office", "Commercial", "Warehouse", "Land", "Industrial Shed"];

export const SERVICE_REQUEST_OPTIONS = {
  property_buy: {
    label: "Buy Property",
    requestCategory: "property_buy",
    propertyTypes: PROPERTY_REQUEST_TYPES,
    budgetLabel: "Budget",
  },
  property_sell: {
    label: "Sell Property",
    requestCategory: "property_sell",
    propertyTypes: PROPERTY_REQUEST_TYPES,
    budgetLabel: "Expected Price",
  },
  property_rent: {
    label: "Rent Property",
    requestCategory: "property_rent",
    propertyTypes: RENT_REQUEST_TYPES,
    budgetLabel: "Monthly Rent Budget",
  },
  loan: {
    label: "Loan",
    requestCategory: "loan",
    serviceTypes: ["Home Loan", "Plot Loan", "Mortgage Loan", "Private Finance"],
    budgetLabel: "Loan Amount",
  },
  interior: {
    label: "Interior",
    requestCategory: "interior",
    serviceTypes: ["Home Interior", "Office Interior"],
    budgetLabel: "Project Budget",
  },
  construction: {
    label: "Construction",
    requestCategory: "construction",
    serviceTypes: ["House Construction", "Office Construction", "Commercial Building", "Apartment", "Industry & Warehouse"],
    budgetLabel: "Project Budget",
  },
  property_management: {
    label: "Property Management",
    requestCategory: "property_management",
    serviceTypes: [
      "Home & Apartment Facility AMC Service",
      "Industry & Warehouse Facility AMC Service",
      "Land Scraping & Garden Maintenance Property Management Service",
      "NRI Property Management Service",
    ],
    budgetLabel: "Annual Budget",
  },
  home_office_services: {
    label: "Home & Office Services",
    requestCategory: "home_office_services",
    serviceTypes: [
      "Home & Office Cleaning Service - Deep Cleaning",
      "Home & Office Shifting Service - Packers & Movers",
      "Home Appliance Service - TV, Fridge, Washing Machine Service",
      "Electrical & Plumbing Service",
      "Interior & Carpentry Work",
      "Pest Control Service",
      "Tank, Sump & Bathroom Cleaning Service",
      "Painting Work",
      "Sofa & Carpet Cleaning",
    ],
    budgetLabel: "Service Budget",
  },
};

export const SERVICE_REQUEST_CATEGORY_LIST = Object.values(SERVICE_REQUEST_OPTIONS);
