export type RideshareEntry = {
  id: string;
  user_id: string;
  is_driver: boolean;
  seats: number;
  note: string;
  profiles: {
    first_name: string;
  } | null;
};
