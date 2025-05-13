export interface Option {
  value: string;
  title: string;
  selectable: boolean;
  classes?: string
  icon?: any;
  suboptions?: Option[];
}