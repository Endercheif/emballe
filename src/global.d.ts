interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface AuthParams {
  clientID: string;
  clientSecret: string;
  username: string;
  password: string;
  userAgent: string;
}

type Kind = "t1_" | "t2_" | "t3_" | "t4_ " | "t5_" | "t6_";
