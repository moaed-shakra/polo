type Region = "us-east-1" | "eu-central-1" | "ap-southeast-1";

const regionMap: { [key: string]: Region } = {
  "Europe/": "eu-central-1",
  "America/": "us-east-1",
  "Asia/": "ap-southeast-1",
  "Australia/": "ap-southeast-1",
  "Pacific/": "ap-southeast-1",
};

export function getClosestRegion(timezone: string): Region {
  for (const [prefix, region] of Object.entries(regionMap)) {
    if (timezone.startsWith(prefix)) {
      return region;
    }
  }
  return "us-east-1"; // Default to US East if no match
} 