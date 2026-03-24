import { TableColKey } from "@/common/enum";

export interface TableColDef {
  key: TableColKey;
  labelKey: string;
  sortable: boolean;
  defaultVisible: boolean;
  width?: number;
}
