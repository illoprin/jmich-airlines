export interface Airport {
  id: number;
  name: string;
  code: string;
}

export interface City {
  id: number;
  name: string;
  image: string;
  airport?: Airport;
  airports?: Airport[];
}
