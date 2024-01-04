import { Ratelimit } from "@upstash/ratelimit";
import redis from "./redis";

export const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      //limit only 2 requests in a window of 2 minutes
      limiter: Ratelimit.fixedWindow(2, "2 m"),
      analytics: true,
    })
  : undefined;