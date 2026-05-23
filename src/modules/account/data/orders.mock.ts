import type { Order } from "../types";

export const ORDERS_MOCK: Order[] = [
  { id: "o1", code: "#LB-98321", date: "12/10/2023", total: 1250000, status: "delivered" },
  { id: "o2", code: "#LB-97210", date: "25/10/2023", total: 450000, status: "shipping" },
  { id: "o3", code: "#LB-96854", date: "02/11/2023", total: 2100000, status: "processing" },
  { id: "o4", code: "#LB-96701", date: "02/11/2023", total: 2100000, status: "processing" },
  { id: "o5", code: "#LB-96500", date: "02/11/2023", total: 2100000, status: "processing" },
  { id: "o6", code: "#LB-96322", date: "02/11/2023", total: 2100000, status: "processing" },
  { id: "o7", code: "#LB-96100", date: "02/11/2023", total: 2100000, status: "processing" },
  { id: "o8", code: "#LB-95800", date: "02/11/2023", total: 2100000, status: "processing" },
  { id: "o9", code: "#LB-95601", date: "02/11/2023", total: 2100000, status: "processing" },
  { id: "o10", code: "#LB-95400", date: "02/11/2023", total: 2100000, status: "processing" },
];
