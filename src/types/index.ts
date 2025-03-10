export type Region = {
  id: string;
  ua_id: string;
  name: string;
  is_eastern: boolean;
  is_occupied: boolean;
  alert_id?: string;
  neighbors: string[];
  path: string;
};

export type Alert = {
  id: string;
  name: string;
  description: string;
  severity: string;
  image_path: string;
  color: string;
};

export type Infrastructure = {
  id: string;
  name: string;
  description: string;
  icon: string;
  impact: string;
};

export type AlertHistory = {
  id: string;
  region_id: string;
  alert_id?: string;
  status: 'тривога' | 'відбій' | 'звільнено';
  timestamp: string;
};
