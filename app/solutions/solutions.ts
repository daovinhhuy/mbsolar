export type Solution = {
  id: string;
  title: string;
  introduction: string;
  sections: { image: string | null; content: string | null }[];
};
