import api from "./axios";

export const linkBankAccount = (data) =>
  api.post("/user/bank/link", data);
