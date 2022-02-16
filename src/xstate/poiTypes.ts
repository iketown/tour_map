import {
  MdLocalAirport,
  MdAtm,
  MdDirectionsBus,
  MdCarRepair,
  MdDirectionsCar,
  MdLocalCafe,
  MdLocalConvenienceStore,
  MdHealthAndSafety,
  MdStore,
  MdLocalHospital,
  MdLocalLaundryService,
  MdTrain,
  MdOutlineTrain,
  MdLiquor,
  MdHotel,
  MdFastfood,
  MdPark,
  MdLocalPharmacy,
  MdLocalPolice,
  MdLocalPostOffice,
  MdRestaurant,
  MdDirectionsSubway,
} from "react-icons/md";
import { BiDrink } from "react-icons/bi";
import {
  FaShoppingBag,
  FaFlag,
  FaParking,
  FaCaravan,
  FaBusAlt,
} from "react-icons/fa";
import { GiSmartphone, GiGasPump } from "react-icons/gi";
import { CgGym } from "react-icons/cg";
import { GrSpa } from "react-icons/gr";

export const poiTypes = [
  { name: "airport", icon: MdLocalAirport },
  { name: "lodging", icon: MdHotel },
  { name: "train_station", icon: MdTrain },
  { name: "atm", icon: MdAtm },
  { name: "bar", icon: BiDrink },
  { name: "bus_station", icon: MdDirectionsBus },
  { name: "cafe", icon: MdLocalCafe },
  { name: "car_rental", icon: MdDirectionsCar },
  { name: "car_repair", icon: MdCarRepair },
  {
    name: "convenience_store",
    icon: MdLocalConvenienceStore,
  },
  { name: "department_store", icon: FaShoppingBag },
  { name: "doctor", icon: MdHealthAndSafety },
  { name: "drugstore", icon: MdStore },
  { name: "electronics_store", icon: GiSmartphone },
  { name: "embassy", icon: FaFlag },
  { name: "gas_station", icon: GiGasPump },
  { name: "gym", icon: CgGym },
  { name: "hospital", icon: MdLocalHospital },
  { name: "laundry", icon: MdLocalLaundryService },
  {
    name: "light_rail_station",
    icon: MdOutlineTrain,
  },
  { name: "liquor_store", icon: MdLiquor },
  { name: "meal_takeaway", icon: MdFastfood },
  { name: "park", icon: MdPark },
  { name: "parking", icon: FaParking },
  { name: "pharmacy", icon: MdLocalPharmacy },
  { name: "police", icon: MdLocalPolice },
  { name: "post_office", icon: MdLocalPostOffice },
  { name: "restaurant", icon: MdRestaurant },
  { name: "rv_park", icon: FaCaravan },
  { name: "spa", icon: GrSpa },
  { name: "subway_station", icon: MdDirectionsSubway },
  { name: "supermarket", icon: MdStore },
  { name: "transit_station", icon: FaBusAlt },
] as const;

export type POItype = typeof poiTypes[number];
