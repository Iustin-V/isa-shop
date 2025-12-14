export type GuardResult =
  | { allow: true }
  | { allow: false; status: number; message: string };
