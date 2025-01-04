export interface Store {
  Id: string;
  Name: string;
  OwnerName: string;
  ContactNumberOne: string;
  ContactNumberTwo: string;
  CategoryName: string;
  SubCategoryName: string;
  Tags: string;
  Address: string;
  StreetName: string;
  AreaName: string;
  City: string;
  State: string;
  Pin: string;
  LandMark: string;
  GeoLocation: string;
  OpenTime: string;
  CloseTime: string;
  StoreImage: any;
}

export interface CategoryNames {
  CategoryName: string;
  SubCategoryName: string;
}
